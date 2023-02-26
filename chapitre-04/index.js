const logEvents = require('./logEvents')

const EventEmitter = require('events') 

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()

// add listener for the log event  
myEmitter.on("log", (msg) => logEvents(msg))

setTimeout(() => {
    // emit event
    myEmitter.emit("log",  "Vous avez ete attaquer" )
}, 2000)