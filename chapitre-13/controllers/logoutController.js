const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromise = require('fs').promises
const path = require('path')

// cette methode va nous permettre de regenerer un nouveau token d'access 
const handleLogout =  async (req, res) => {

    // delete access token 
    const cookies = req.cookies 
    if(!cookies?.jwt) return res.sendStatus(204)  // no conent 
    const refreshToken = cookies.jwt
    

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken )
    console.log(foundUser)
    
    // user does not exist 
    if(!foundUser) {
        res.clearCookie("jwt" , {httpOnly: true, secure: true, sameSite: 'None'})
        return res.sendStatus(204) // Forbidden
    }

    // delete refreshToken in db 
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    userDB.setUsers([...otherUsers, currentUser])

    // persist data 
    await fsPromise.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(userDB.users)
    )

    res.clearCookie("jwt", {httpOnly: true})
    res.sendStatus(204)


}

module.exports = {handleLogout}