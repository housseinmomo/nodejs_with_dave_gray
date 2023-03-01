const jwt = require('jsonwebtoken')
require('dotenv').config()

// Ce middleware va verifier si le token de l'utilisateur 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startWith("Bearer")) return res.sendStatus(401) // Unauthorized      
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
            req.user  = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles 
            next()
        }
    )
}

module.exports = verifyJWT 