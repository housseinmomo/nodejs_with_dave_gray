const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')

const PORT =  process.env.PORT || 3500 
const host = "127.0.0.0"

// On definie l'ensemble des address|domaines pouvant faire des requetes a notre serveur
const whiteList = ['https://www.mugen-portfolio.com', 'http://127.0.0.1:5500', 'http://react-app.com']

const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin ) {
            // si la requete se trouve dans la liste blanche
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200
}
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
 
// serve static files 
app.use('/', express.static(path.join(__dirname, "/public")))
app.use('subdir', express.static(path.join(__dirname, "/public")))

// routes
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))

// Express accepte les expression reguliere 
/*
   ^ : doit debuter  
   $ : doit finir 
   | : ou 
   (contenue)? : rendre optionnelle 
*/


app.all("*", (req, res) => { 
    // Ici on customise le type de reponse selon le type attendu par l'utilisateur 
    res.status(404)
    if(req.accepts("html")) {res.sendFile(path.join(__dirname, "views","404.html"))}
    else if (req.accepts("json")) {res.json({error: "404 Not Found"})}
    else {res.type("txt").send("404 Not Found")}
})

app.use(errorHandler)



app.listen(PORT, () => console.log(`Server running on ${host}:${PORT}`))

