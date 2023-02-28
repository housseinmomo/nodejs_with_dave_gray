const jwt = require('jsonwebtoken')
require('dotenv').config()

// Ce middleware va verifier si le token de l'utilisateur 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if(!authHeader) return res.sendStatus(401) // Unauthorized
    console.log("contenus de authorization headers : ", authHeader) // Bearer token  
      
    // La méthode split() divise une chaîne de caractères en une liste ordonnée de sous-chaînes, place ces sous-chaînes dans un tableau et retourne le tableau
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                console.log("Le token a expirer")
                return res.sendStatus(403)
            } // invalid token  
            req.user = decoded.username
            next()
        }
    )
}

module.exports = verifyJWT 