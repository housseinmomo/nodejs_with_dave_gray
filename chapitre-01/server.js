console.log("Hello world")

// console.log(global)

// Nous donne des informations sur notre machine 
const os = require("os")
const path = require("path")
const {add, subtract, divide, multiply} = require('./math')

console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log("------------------")

console.log(__dirname)
console.log(__filename)

console.log("------------------")

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log("------------------")

// On recupere un objet avec l'ensemble des infos concernant ce fichier 
const fileInfos = path.parse(__filename)
console.log(fileInfos)

console.log("------------------")

console.log(add(10, 12))
console.log(subtract(10, 10))
console.log(divide(10, 2))
console.log(multiply(10, 2))