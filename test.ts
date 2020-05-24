// tests go here; this will not be compiled when this package is used as a library


MPR121.init()
basic.forever(function () {
    for (let i = 0; i < 12; i++) {
        serial.writeNumber(i)
        serial.writeValue("x = ", MPR121.getValue(i))
    }

    basic.pause(100)
})

