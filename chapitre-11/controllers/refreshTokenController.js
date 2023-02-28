const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config()


// cette methode va nous permettre de regenerer un nouveau token d'access 
const handleRefreshToken =  (req, res) => {
    
    const cookies = req.cookies 
    if(!cookies?.jwt) return res.sendStatus(403) 
    console.log("jwt cookies refreshToken ", cookies.jwt)
    const refreshToken = cookies.jwt
    

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken )
    console.log(foundUser)
    // user does not exist 
    if(!foundUser) return res.sendStatus(403) // Forbidden

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
            const accessToken = jwt.sign(
                {"username": decoded.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "30s"}   
            )

            // On renvoi un nouveau token d'access 
            // le controller refreshToken consiste a envoyer un nouveau token 
            res.json({ accessToken })
        }
    )
}

module.exports = {handleRefreshToken}