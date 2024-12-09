const dicc = require ("./datos");


function procesarPeticion(req, res, restoRuta) {
  //       palabras/casa
  //Saber si la ruta tiene parametros o no (Listado o Uno concreto, es decir: a la "Coleccion" o al "Recurso")
  var id = restoRuta.siguiente();

  if (id) {
    procesarRecurso(req, res, id);
  } else {
    procesarColeccion(req, res);
  }
}

function procesarColeccion(req, res) {
  console.log("Palabras procesando coleccion (sin parametros)")
  //qué metodo me pides (GET, POST)
  switch (req.method) {
    case "GET":
        //la lista de palabras (de mi diccionario)
        //habría que comprobar si existe esa palabra en el diccionario
        const palabras = Object.keys(dicc);
        respuestaOK(res, dicc);
      break;
      case "POST":
        var nuevaPalabra = [];
        req.on("data", (data) => {
          nuevaPalabra.push(data);
        });
        req.on("end", () => {
          var objetoBody = JSON.parse(nuevaPalabra.concat());
          //objetoBody.palabra;
          //objetoBody.definicion;
          dicc[objetoBody.palabra] = [objetoBody.definicion];
          respuestaOK(res, "Palabra y definición añadidas al diccionario")
        });
        
      break;
    default:
      respuestaError(res, "Metodo no disponible", 405);
      break;
  }
}

function procesarRecurso(req, res, id) {
  console.log("Palabras procesando recurso (una palabra concreta = "+ id +")");
  //qué metodo me pides (GET, DELETE, PUT, PATCH...)
  if (dicc[id]) {
    switch (req.method) {
      case "GET":
          //buscar esa palabra y devolver la definición
          if (dicc[id]) {
            respuestaOK(res, { palabra: id, definicion: dicc[id] });
          } else {
            respuestaError(res, `La palabra "${id}" no se encuentra en el diccionario`, 404)
          }   
        break;
        case "DELETE":
          delete dicc[id];
          respuestaOK(res, "Palabra eliminada ("+id+")");
          break;
      default:
        respuestaError(res, "Metodo no disponible", 405);
        break;
    }
  } else {
    respuestaError(res, "Palabra no encontrada", 404);
  }
}

module.exports = {
  procesarPeticion,
};


function respuestaOK(res, respuesta) {
  console.log(respuesta)
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.write(
    JSON.stringify({
      "status": "ok",
      "data": respuesta,
    })
  );
  res.end();
}

function respuestaError(res, mensajeError, codigo) {
  res.statusCode = codigo;
  res.setHeader("Content-Type", "application/json");
  res.write(
    JSON.stringify({
      "status": "error",
      "error": mensajeError,
    })
  );
  res.end();
}
