const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromise = require('fs').promises
const path = require('path')
// bcrypt va nous permettre de hacher nos pwd
const bcrypt = require('bcrypt')


const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body
    if(!user || !pwd) { return res.status(400).json({"message": "Username and password are required."}) }

    // check for duplicate username in the db 
    const duplicate = userDB.users.find(person => person.username === user)
    if(duplicate) return res.sendStatus(409) // Conflict
     
    try {
        // encrypt the password  
        const hashedPwd = await bcrypt.hash(pwd, 10)

        // create new user 
        const newUser = {"username": user, "password": hashedPwd} 

        // save newUser into users list into userDB 
        userDB.setUsers([...userDB.users, newUser])

        // persist data into users.json file 
        await fsPromise.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(userDB.users)
        )

        console.log(userDB.users)

        res.status(201).json({"success": `New user ${user} created !`})

    } catch(err) {
        res.status(500).json({"message": err.message})
    }
}

module.exports = {  handleNewUser }