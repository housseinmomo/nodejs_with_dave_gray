const User = require('../model/User')


// cette methode va nous permettre de regenerer un nouveau token d'access 
const handleLogout =  async (req, res) => {

    // delete access token 
    const cookies = req.cookies 
    if(!cookies?.jwt) return res.sendStatus(204)  // no conent 
    const refreshToken = cookies.jwt
    
    // retrieve the user who want to logout
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
    
    // user does not exist 
    if(!foundUser) {
        res.clearCookie("jwt" , {httpOnly: true, secure: true, sameSite: 'None'})
        return res.sendStatus(204) // Forbidden
    }

    // delete refreshToken in db 
    foundUser.refreshToken = ""
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie("jwt", {httpOnly: true})
    res.sendStatus(204)


}

module.exports = {handleLogout}