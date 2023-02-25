const fs = require('fs')

// On va ecouter ce fichier 
const rs = fs.createReadStream("./files/lorem.txt", {encoding: "utf-8"})

// On va ecrire backup a ce niveau 
const ws = fs.createWriteStream("./files/new-lorem.txt")

// On va ecrire le contenus du fichier lorem dans le fichier new-lorem
// Cette methode n'est pas efficiente 
// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk)
// })

// cette methode fait la meme chose 
rs.pipe(ws)