// On definie l'ensemble des address|domaines pouvant faire des requetes a notre serveur
const whiteList = [
    'https://www.mugen-portfolio.com', 
    'http://127.0.0.1:5500', 
    'http://react-app.com'
]

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

module.exports = corsOptions