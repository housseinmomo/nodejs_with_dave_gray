const express = require('express')
const app = express()
const path = require('path')

const PORT =  process.env.PORT || 3500 
const host = "127.0.0.0"

// Express accepte les expression reguliere 
/*
   ^ : doit debuter  
   $ : doit finir 
   | : ou 
   (contenue)? : rendre optionnelle 
*/
app.get("^/$|/index(.html)?", (req, res) => {
    // res.sendFile("./views/index.html", {root: __dirname})
    res.sendFile(path.join(__dirname, "views", "index.html"))
})
 
app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"))
})

app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "new-page.html")
})

app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted to load hello.html")
    // La fonction next() va appeller la fonction qui sera declarer par la suite
    next()
}, (req, res) => {
    res.send("Hello world !")
})

// chaining route handler 
const one = (req, res, next) => {
    console.log("one")
    next()
}

const two = (req, res, next) => {
    console.log("two")
    next()
}

const three = (req, res) => {
    console.log("three")
    res.send("Finished.")
}

app.get('/chain', [one, two, three])

app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})



app.listen(PORT, () => console.log(`Server running on ${host}:${PORT}`))

