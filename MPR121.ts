
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

        MPR121_SOFTRESET = 0x80
    }
    let ADDRESS = 0x5B

    function writeRegister(reg: number, value: number): void{
        // MPR121 must be put in Stop Mode to write to most registers
        
        let stop_required = true;
        let ECR = pins.i2cReadNumber(ADDRESS, NumberFormat.UInt8BE);
        // first get the current set value of the MPR121_ECR register
        
        if (reg == register.MPR121_ECR || (0x73 <= reg && reg <= 0x7A)) {
            stop_required = false;
        }
        if (stop_required) {
            pins.i2cWriteNumber(ADDRESS, register.MPR121_ECR, NumberFormat.UInt8BE, true)
            pins.i2cWriteNumber(ADDRESS, 0x00, NumberFormat.UInt8BE)
        }
        pins.i2cWriteNumber(ADDRESS, reg, NumberFormat.UInt8BE, true)
        pins.i2cWriteNumber(ADDRESS, value, NumberFormat.UInt8BE)

        if (stop_required) {
            pins.i2cWriteNumber(ADDRESS, register.MPR121_ECR, NumberFormat.UInt8BE, true)
            pins.i2cWriteNumber(ADDRESS, ECR, NumberFormat.UInt8BE)
        }
    }
    //% block
    export function init(): number {
        /*
        // soft reset
        writeRegister(register.MPR121_SOFTRESET, 0x63);
        basic.pause(1)
        writeRegister(register.MPR121_ECR, 0x00);

        pins.i2cWriteNumber(ADDRESS, register.MPR121_CONFIG2, NumberFormat.UInt8BE)
        let c = pins.i2cReadNumber(ADDRESS, NumberFormat.UInt8BE);
*/
        // soft reset
        pins.i2cWriteNumber(ADDRESS, 0x5E00, NumberFormat.UInt16BE)
        pins.i2cWriteNumber(ADDRESS, 0x8063, NumberFormat.UInt16BE);
        pins.i2cWriteNumber(ADDRESS, 0x5E00, NumberFormat.UInt16BE);
        pins.i2cWriteNumber(ADDRESS, 0x5D00, NumberFormat.UInt16BE);
        let c = pins.i2cReadNumber(ADDRESS, NumberFormat.UInt8BE);
        return (register.MPR121_SOFTRESET << 8) | 0x63
    }

   
}