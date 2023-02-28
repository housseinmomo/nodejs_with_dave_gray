// NPM Modules 
const { format } = require('date-fns')
const {v4: uuid} = require('uuid')

// Core Module 
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

// log function 
const logEvents = async (message, fileName) => {
    const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`
    const logItem = `ID: ${uuid()}\t DateTime: ${dateTime}\t Message: ${message}\n`
    console.log(logItem)

    try {
        // si le dossier n'existe pas, on doit le creer par nous meme 
        if(!fs.existsSync(path.join(__dirname,"..", "logs"))) {
            await fsPromise.mkdir(path.join(__dirname, ".." , "logs"))
        }
        await fsPromise.appendFile(path.join(__dirname, ".." ,"logs", fileName), logItem)
    } catch(err) {
        console.error(err)
    }
}

const logger = (req , res, next) => {
    console.log(`${req.method} ${req.path}`)
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt")
    // on doit obligatoirement appeller la fonction next()
    // pour pas arreter le traitement 
    next()
}

module.exports = {logger, logEvents}
