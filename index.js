require("dotenv").config();
const mimodulito = require("./analizarRutas");
const moduloPalabras = require("./palabras/palabras");
const http = require("http");

//Esto crea un servidor:
const miServidor = http.createServer((req, res) => {


  const miUrl = new URL(req.url, "http://localhost");
  mimodulito.empezar(miUrl.pathname);

  var apiPedida = mimodulito.siguiente();
  switch (apiPedida) {
    case "palabras":
      //Le pasaré la petición al módulo de diccionario:
      moduloPalabras.procesarPeticion(req, res, mimodulito);
      break;

    case "archivos":
      //le pasaré la petición al módulo archivos
      break;
    default:
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write(
        JSON.stringify({
          status: "error",
          error: "ruta no válida",
        })
      );
      res.end();
      break;
  }
});

//Para que el servidor escuche:
miServidor.listen(process.env.PORT, () => {
  console.log("Servidor iniciado en el puerto", process.env.PORT, "...");
});
