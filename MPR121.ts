
//% weight=100 color=#0fbc11 icon=""
namespace MPR121 {
    enum register
    {
        MPR121_TOUCHSTATUS_L = 0x00,
        MPR121_TOUCHSTATUS_H = 0x01,
        MPR121_FILTDATA_0L = 0x04,
        MPR121_FILTDATA_0H = 0x05,
        MPR121_BASELINE_0 = 0x1E,
        MPR121_MHDR = 0x2B,
        MPR121_NHDR = 0x2C,
        MPR121_NCLR = 0x2D,
        MPR121_FDLR = 0x2E,
        MPR121_MHDF = 0x2F,
        MPR121_NHDF = 0x30,
        MPR121_NCLF = 0x31,
        MPR121_FDLF = 0x32,
        MPR121_NHDT = 0x33,
        MPR121_NCLT = 0x34,
        MPR121_FDLT = 0x35,

        MPR121_TOUCHTH_0 = 0x41,
        MPR121_RELEASETH_0 = 0x42,
        MPR121_DEBOUNCE = 0x5B,
        MPR121_CONFIG1 = 0x5C,
        MPR121_CONFIG2 = 0x5D,
        MPR121_CHARGECURR_0 = 0x5F,
        MPR121_CHARGETIME_1 = 0x6C,
        MPR121_ECR = 0x5E,
        MPR121_AUTOCONFIG0 = 0x7B,
        MPR121_AUTOCONFIG1 = 0x7C,
        MPR121_UPLIMIT = 0x7D,
        MPR121_LOWLIMIT = 0x7E,
        MPR121_TARGETLIMIT = 0x7F,

        MPR121_GPIODIR = 0x76,
        MPR121_GPIOEN = 0x77,
        MPR121_GPIOSET = 0x78,
        MPR121_GPIOCLR = 0x79,
        MPR121_GPIOTOGGLE = 0x7A,

        MPR121_SOFTRESET = 0x80,

        MPR121_TOUCH_THRESHOLD_DEFAULT = 12,
        MPR121_RELEASE_THRESHOLD_DEFAULT = 6
    }
    const ADDRESS = 0x5B

    // default touch threshold value
    const TOUCH_THRESHOLD_DEFAULT = 12  
    const MPR121_RELEASE_THRESHOLD_DEFAULT =  6 

    function writeRegister(reg: number, value: number): void{
        pins.i2cWriteNumber(ADDRESS, (reg << 8) | value, NumberFormat.UInt16BE)
    }
    function setThresholds(touch: number, release: number): void {
        // first stop sensor to make changes
        writeRegister(register.MPR121_ECR, 0x00);
        // set all thresholds (the same)
        for (let i = 0; i < 12; i++) {
            writeRegister(register.MPR121_TOUCHTH_0 + 2 * i, touch);
            writeRegister(register.MPR121_RELEASETH_0 + 2 * i, release);
        }
        // turn the sensor on again
        writeRegister(register.MPR121_ECR, 0x8F);
    }
    //% block
    export function init(): void {
        let autoconfig = false

        // soft reset
        writeRegister(register.MPR121_SOFTRESET, 0x63);
        basic.pause(1)
        writeRegister(register.MPR121_ECR, 0x00);

        setThresholds(register.MPR121_TOUCH_THRESHOLD_DEFAULT, 
                        register.MPR121_RELEASE_THRESHOLD_DEFAULT);

        writeRegister(register.MPR121_MHDR, 0x01);
        writeRegister(register.MPR121_NHDR, 0x01);
        writeRegister(register.MPR121_NCLR, 0x0E);
        writeRegister(register.MPR121_FDLR, 0x00);

        writeRegister(register.MPR121_MHDF, 0x01);
        writeRegister(register.MPR121_NHDF, 0x05);
        writeRegister(register.MPR121_NCLF, 0x01);
        writeRegister(register.MPR121_FDLF, 0x00);

        writeRegister(register.MPR121_NHDT, 0x00);
        writeRegister(register.MPR121_NCLT, 0x00);
        writeRegister(register.MPR121_FDLT, 0x00);

        writeRegister(register.MPR121_DEBOUNCE, 0);
        writeRegister(register.MPR121_CONFIG1, 0x10); // default, 16uA charge current
        writeRegister(register.MPR121_CONFIG2, 0x20); // 0.5uS encoding, 1ms period

        if (autoconfig)
        {
            writeRegister(register.MPR121_AUTOCONFIG0, 0x0B);

            // correct values for Vdd = 3.3V
            writeRegister(register.MPR121_UPLIMIT, 200);     // ((Vdd - 0.7)/Vdd) * 256
            writeRegister(register.MPR121_TARGETLIMIT, 180); // UPLIMIT * 0.9
            writeRegister(register.MPR121_LOWLIMIT, 130);    // UPLIMIT * 0.65
        }
        

        // enable X electrodes and start MPR121
        let ECR_SETTING = 0B10000000 + 12; // 5 bits for baseline tracking & proximity disabled + X
        // amount of electrodes running (12)
        writeRegister(register.MPR121_ECR, ECR_SETTING); // start with above ECR setting
    }

    //%block
    export function getValue(): number{
        writeRegister(register.MPR121_TOUCHSTATUS_L, 0x00)
        let t = pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16BE);
        return t & 0x0FFF;
    }
   
}