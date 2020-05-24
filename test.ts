// tests go here; this will not be compiled when this package is used as a library


MPR121.init()
basic.forever(function () {
    for (let i = 0; i < 12; i++) {
        if (MPR121.getValue(i)) {

            serial.writeValue("touched", i)
        }
    }

    basic.pause(100)
})

