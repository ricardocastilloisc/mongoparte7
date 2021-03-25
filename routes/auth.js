const express = require("express");

const bcrypt = require("bcrypt");
const ruta = express.Router();
const config = require('config')
const jwt = require("jsonwebtoken");

//const Joi = require("@hapi/joi");

const Usuario = require("../models/usuario_model");

ruta.post("/", (req, res) => {
  Usuario.findOne({ email: req.body.email })
    .then((datos) => {
      if (datos) {
        const passwordValido = bcrypt.compareSync(
          req.body.password,
          datos.password
        );
        if (passwordValido) {
          const jwToken = jwt.sign(
            {
              usuario: { _id: datos.id, nombre: datos.nombre, email: datos.email },
            },
            config.get('configToken.SEED'),
            { expiresIn: config.get('configToken.expiration') }
          );
          res.json(
              {
                  usuario:{
                      _id: datos.id,
                      nombre: datos.nombre,
                      email: datos.email
                  },
                  jwToken
              }
          );
        } else {
          return res
            .status(400)
            .json({ error: "ok", msj: "Usuario o contraseña incorrecta." });
        }
      } else {
        res
          .status(400)
          .json({ error: "ok", msj: "Usuario o contraseña incorrecta." });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: "ok", msj: "error en el vercion" });
    });
});

module.exports = ruta;
