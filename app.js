const usuario = require('./routes/usuario')
const cursos = require('./routes/cursos')
const express = require("express");
const mongoose = require("mongoose");




mongoose
  .connect("mongodb://localhost/demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("conectado a mongoDb"))
  .catch((err) => console.log("no se pudo conectar", err));



const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios', usuario);
app.use('/api/cursos', cursos);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("api rest", port);
});
