const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body
    if(!user || !pwd) { return res.status(400).json({"message": "Username and password are required."}) }

    // find user with username 
    const foundUser = userDB.users.find(person => person.username === user )
    // user does not exist 
    if(!foundUser) return res.sendStatus(401) // Unauthorized

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        // create JWT (JSON Web Token) :creation de token qui va nous permettre de creer des routes securiser 
        res.json({"success": `User ${user} is logged in !`})
    } else { 
        res.sendStatus(401) // Unauthorized
    }   
}

module.exports = {handleLogin}