require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const { log } = require('console')

// config server 
const PORT =  process.env.PORT || 3500 
const host = "127.0.0.0"

// COnnect to MongoDB 
connectDB()

// Express accepte les expression reguliere 
/*
   ^ : doit debuter  
   $ : doit finir 
   | : ou 
   (contenue)? : rendre optionnelle 
*/

app.use(credentials)

// app.use() : n'accepte pas le regex
// Cross origin ressource sharing 
// Va nous permettre de securiser notre serveur en specifiant qui est autoriser ou non a faire des requetes a ce dernier 
// Il faut savoir qu'apres chaque requetes, le serveur va passer par ce custom middleware pour verifier si ce domaine est ligitime ou pas 
app.use(cors(corsOptions))

// custom midlleware logger 
app.use(logger)

// Les middlewares s'execute entre une requete et une reponse dans les routes 
// built-in middleware to handle urlencoded data
// In other word, form data 
// Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))

// built-in middleware for json 
app.use(express.json())

// middleware for cookies 
app.use(cookieParser())
 
// serve static files 
app.use('/', express.static(path.join(__dirname, "/public")))

// routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
 
// Les verifications de ce middleware vont s'appliquer que sur les routes ci-dessous : employees 
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))


app.all("*", (req, res) => { 
    // Ici on customise le type de reponse selon le type attendu par l'utilisateur 
    res.status(404)
    if(req.accepts("html")) {res.sendFile(path.join(__dirname, "views","404.html"))}
    else if (req.accepts("json")) {res.json({error: "404 Not Found"})}
    else {res.type("txt").send("404 Not Found")}
})

app.use(errorHandler)

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on ${host}:${PORT}`))
})

