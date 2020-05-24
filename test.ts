// tests go here; this will not be compiled when this package is used as a library


MPR121.init()
basic.forever(function () {
    serial.writeValue("x", MPR121.getValue())
    basic.pause(100)
})

