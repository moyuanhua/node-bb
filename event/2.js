const EventEmitter = require('events')
// const { inherits } = require('util')


function inherits(ctor, superCtor) {
    Object.defineProperty(ctor, 'super_', {
        value: superCtor,
        writable: true,
        configurable: true
    })
    Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
}

function Event() {
    EventEmitter.call(this)
}
inherits(Event, EventEmitter)

let newevent = new Event();
newevent.on('event1', () => {
    console.log(1)
})
newevent.emit('event1')