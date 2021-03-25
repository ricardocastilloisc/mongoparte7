const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const ruta = express.Router();

const verificarToken = require('../middlewares/auth')

const Joi = require("@hapi/joi");

const Usuario = require("../models/usuario_model");

const schema = Joi.object({
  nombre: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});



ruta.get("/", verificarToken, (req, res) => {
  let resultado = listarusuariosActivos();
  resultado
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.put("/:email", verificarToken, (req, res) => {
  const { error, value } = schema.validate({ nombre: req.body.nombre });
  if (!error) {
    let resultado = actulizarUsuario(req.params.email, req.body);

    resultado
      .then((valor) => {
        res.json({
          email: valor.email,
          nombre: valor.nombre,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});
ruta.delete("/:email",  verificarToken,(req, res) => {
  let resultado = desactivarUsuario(req.params.email);
  resultado
    .then((valor) => {
      res.json({
        email: valor.email,
        nombre: valor.nombre,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.post("/", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ error: "server error" });
    }

    if (user) {
      return res.status(400).json({ msj: "El usuario ya existe" });
    }
  });
  const { error, value } = schema.validate({
    nombre: body.nombre,
    email: body.email,
  });
  if (!error) {
    let resultado = crearUsuario(body);
    resultado
      .then((user) => {
        res.json({
          email: user.email,
          nombre: user.nombre,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

crearUsuario = async (body) => {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: bcrypt.hashSync(body.password, 10),
  });
  return await usuario.save();
};

listarusuariosActivos = async () => {
  let usuarios = await Usuario.find({ estado: true }).select({
    nombre: 1,
    email: 1,
  });
  return usuarios;
};
actulizarUsuario = async (email, body) => {
  let usuario = await Usuario.findOneAndUpdate(
    { email: email },
    {
      $set: {
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10),
      },
    },
    {
      new: true,
    }
  );
  return usuario;
};

validarUsuario = async (email) => {
  return await Usuario.findOne({ email: body.email });
};

desactivarUsuario = async (email) => {
  let usuario = await Usuario.findOneAndUpdate(
    { email: email },
    {
      $set: {
        estado: false,
      },
    },
    {
      new: true,
    }
  );
  return usuario;
};

module.exports = ruta;
