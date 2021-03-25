const usuario = require('./routes/usuario')
const cursos = require('./routes/cursos')
const auth = require('./routes/auth')
const express = require("express");
const mongoose = require("mongoose");
const config = require('config')

mongoose
  .connect(config.get('configDB.HOST'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("conectado a mongoDb"))
  .catch((err) => console.log("no se pudo conectar", err));

mongoose.set('useCreateIndex', true);
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios', usuario);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth)
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("api rest", port);
});
