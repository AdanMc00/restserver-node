const express = require('express');
let {auth, verificarAdminRole} = require('../middlewares/jwt')
const _ = require('underscore')
let Categoria = require('../models/categoria');
let app = express();

app.get('/categoria', auth, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message:
                    err
                })
            }
            res.json({
                ok: true,
                categorias: categoriasDB
            })
        })
})

app.get('/categoria/:id', auth, (req, res) => {
    let id = req.params.id
    Categoria.findById(id)
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message:
                    err
                })
            }
            res.json({
                ok: true,
                categoria
            })
        })
})

    app.post('/categoria', auth, (req, res) => {

        let body = req.body;
        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        })
        categoria.save((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
    })

    app.put('/categoria/:id', auth, (req, res) => {

        let id = req.params.id;
        let body = _.pick(req.body, ['descripcion', 'usuario']);

        Categoria.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true

        }, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })

    })

    app.delete('/categoria/:id', [auth, verificarAdminRole], (req, res) => {
        let id = req.params.id;
        Categoria.findByIdAndRemove(id, (err, done) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                done
            })
        })
    })

    module.exports = app;