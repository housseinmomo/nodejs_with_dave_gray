const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromise = require('fs').promises


const logEvents = require('./logEvents')
const EventEmitter = require('events') 
const { date } = require('date-fns/locale')
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName)) // add listener for the log event  
const PORT = process.env.PORT || 3500 

 const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromise.readFile(filePath, "utf-8")
        const data = contentType === "application/json"
            ? JSON.parse(rawData)
            : rawData

        response.writeHead(200, {'Content-Type': contentType})
        response.end(
            contentType === "application/json"
                ? JSON.stringify(data)
                : data
        )
    } catch (err) {
        console.error(err)
        myEmitter.emit("log",  `${err.name}: ${err.message}`, "errLog.txt" )
        response.statusCode = 500
        response.end()
    }
 }


const server = http.createServer((req, res) => {
    
    console.log(req.url, req.method) 
    myEmitter.emit("log",  `${req.url}\t${req.method}`, "reqLog.txt" )

    // On recupere l'extension de notre url 
    const extension = path.extname(req.url);

    // Puis on va definir le contentType selon l'extension de notre url 
    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath = 
        contentType === "text/html" && req.url === "/"
            ? path.join(__dirname, "views", "index.html")
            : contentType === "text/html" && req.url.slice(-1) === "/" // sub-directory exp: /produit/
                ? path.join(__dirname, "views", req.url, "index.html") // /produit/index.html
                : contentType === "text/html"
                    ? path.join(__dirname, "views", req.url)
                    : path.join(__dirname, req.url)


    if(!extension && req.url.slice(-1) !== '/') filePath += '.html'

    const fileExists = fs.existsSync(filePath)

    if(fileExists) {
        // serve the file 
        serveFile(filePath, contentType, res)
    } else {
        console.log(path.parse(filePath))

        switch(path.parse(filePath).base) {
             // 301 redirect    
            case "old-page.html":
                res.writeHead(301, {'location': './new-page.html'})
                res.end()
                console.log("redirect case");
                break
            case "www-page.html":
                res.writeHead(301, {'Location': "/"})
                res.end()
                console.log("redirect case");
                break
            default:
                // serve a 404 response
                serveFile(path.join(__dirname, "views", "404.html"), "text/html", res)
                console.log("404 case");
        }   
    }


    // Cette methode n'est pas conseiller
    // if(req.url === '/' || req.url === 'index.html') {
    //     res.statusCode = 200
    //     res.setHeader('Content-Type', 'text/html')
    //     path = path.join(__dirname, "views", "index.html")
    //     fs.readFile(path, "utf-8", (err, data) => {
    //         if(err) throw err 
    //         res.end(data)
    //     })
    // }
})
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

// setTimeout(() => {
//     // emit event
//     myEmitter.emit("log",  "Vous avez ete attaquer" )
// }, 2000)