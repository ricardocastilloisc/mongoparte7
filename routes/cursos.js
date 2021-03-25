const express = require("express");
const ruta = express.Router();
const Joi = require("@hapi/joi");
const Curso = require("../models/curso_model");
const verificarToken = require('../middlewares/auth');

const schema = Joi.object({
  titulo: Joi.string().min(3).max(30).required(),
}
);

ruta.get("/", verificarToken, (req, res) => {
  let resultado = listarCursosActivos();
  resultado
    .then((Cursos) => {
      res.json(Cursos);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.put("/:id", verificarToken, (req, res) => {
  const { error, value } = schema.validate({ titulo: req.body.titulo });
  if (!error) {
    let resultado = actulizarCurso(req.params.id, req.body);
    resultado
      .then((valor) => {
        res.json({
          valor: valor,
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

ruta.delete("/:id",  verificarToken,(req, res) => {
  let resultado = desactivarCurso(req.params.id);
  resultado
    .then((valor) => {
      res.json({
        Curso: valor,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.post("/", verificarToken, (req, res) => {
  let body = req.body;
  console.log(body);
  const { error, value } = schema.validate({
    titulo: body.titulo
  });
  if (!error) {
    let resultado = crearCurso(body);
    resultado
      .then((curso) => {
        res.json({
          valor: curso,
        });
      })
      .catch((err) => {
        res.status(400).json({
          errorHttp: err,
        });
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

crearCurso = async (body) => {
  let curso = new Curso({
    titulo: body.titulo,
    descripcion: body.descripcion,
  });
  return await curso.save();
};


listarCursosActivos = async () => {
  let cursos = await Curso.find({ estado: true });
  return cursos;
};

actulizarCurso = async (id, body) => {
  let curso = await Curso.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        titulo: body.titulo,
        descripcion: body.descripcion,
      },
    },
    {
      new: true,
    }
  );
  return curso;
};

desactivarCurso = async (id) => {
  let curso = await Curso.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        estado: false,
      },
    },
    {
      new: true,
    }
  );
  return curso;
};

module.exports = ruta;
