// On definie l'ensemble des address|domaines pouvant faire des requetes a notre serveur
const allowOrigins = require('./allowOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if(allowOrigins.indexOf(origin) !== -1 || !origin ) {
            // si la requete se trouve dans la liste blanche
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions