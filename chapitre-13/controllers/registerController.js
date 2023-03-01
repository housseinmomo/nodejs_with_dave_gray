const User = require('../model/User')
// bcrypt va nous permettre de hacher nos pwd
const bcrypt = require('bcrypt')


const handleNewUser = async (req, res) => {
    
    const {user, pwd} = req.body
    if(!user || !pwd) { return res.status(400).json({"message": "Username and password are required."}) }

    // check for duplicate username in the db 
    const duplicate = await User.findOne({username: user}).exec()

    if(duplicate) return res.sendStatus(409) // Conflict

    // encrypt the password  
    const hashedPwd = await bcrypt.hash(pwd, 10)

    // create and save newUser into mongo database 
 
    const result = await User.create({
        "username": user, 
        "password": hashedPwd
    })
    console.log("user est bien creer")
    console.log(result)

    res.status(201).json({"success": `New user ${user} created !`})
}

module.exports = {  handleNewUser }