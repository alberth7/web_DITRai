const express = require('express')
const app = express();
const multer = require('multer')
const mimeTypes = require('mime-types')

const fileUpload  = require('express-fileupload');
const cors = require('cors');

app.use(fileUpload())
app.use(cors());
app.use(express.json())
app.use(express.static('public'));
const fs = require('fs');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
        let nameFile = Date.now() + file.originalname+ "."+mimeTypes.extension(file.mimetype)
        cb("", nameFile)
    }
})

const upload = multer({
    //dest: 'uploads/'
    storage: storage
})

app.get('/main.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/views/main.js');
  });

app.get('/main.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/views/main.css');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')

});


app.post("/upload",(req, res)=>{
    const archivo = req.files.file;
    console.log(archivo);
    //res.send(`Archivo ${req.files.file.name} subido correctamente al servidor`);
    
    //res.send("Archivo subido correctamente");
    
    archivo.mv('uploads/' + archivo.name, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.send('Archivo cargado correctamente.');
      });
})

app.post("/files", upload.single('file'), (req, res) => {
    res.send("Todo bien!");
});


app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'");
    next();
  });

// Definir la ruta '/api'
app.get('/apitest', (req, res) => {
    // Crear un objeto JSON con los datos a enviar
    const data = 
        [{
            "id": "BR",
            "name": "Brasil",
            "size": 7.5,
            "date": "26 October 2015",
            "description": "Hindu Kush earthquake",
            "percent":"0.96 - 0.98",
            "protocolo":"tcp",
            "ipdst":"172.19.56.59 - 178.156.23.15",
            "ipsrc":"10.0.1.52"
        },
        {
            "id": "VN",
            "name": "Vietnam",
            "size": 6.8,
            "date": "24 June 1983",
            "description": "Tuan Giao earthquake",
            "percent":"0.97",
            "protocolo":"tcp",
            "ipdst":"179.223.112.88",
            "ipsrc":"10.0.1.52"

        }];
  
    // Enviar el objeto JSON como respuesta
    res.json(data);
  });

app.get('/api', (req, res) => {
    fs.readFile('/home/michael/Documents/code/dragDrop/server/results/resultadoAI.json', 'utf8', (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });  

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});

