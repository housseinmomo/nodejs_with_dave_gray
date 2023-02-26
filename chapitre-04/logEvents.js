// NPM Modules 
const { format } = require('date-fns')
const {v4: uuid} = require('uuid')

// Core Module 
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

// log function 
const logEvents = async (message) => {
    const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`
    const logItem = `ID: ${uuid()}\t DateTime: ${dateTime}\t Message: ${message}\n`
    console.log(logItem)

    try {
        // si le dossier n'existe pas, on doit le creer par nous meme 
        if(!fs.existsSync(path.join(__dirname, "logs"))) {
            await fsPromise.mkdir(path.join(__dirname, "logs"))
        }
        await fsPromise.appendFile(path.join(__dirname, "logs", "eventLog.txt"), logItem)
    } catch(err) {
        console.error(err)
    }
}

module.exports = logEvents
