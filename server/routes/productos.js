const express = require('express');
const {auth} = require('../middlewares/jwt')
let Producto = require('../models/productos')
let app= express();


app.get('/producto', auth, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message:
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

app.get('/producto/:id', auth, (req, res) => {
    let id = req.params.id
    Producto.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message:
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
})

app.get('/producto/buscar/:word', auth,(req,res) => {
    let word = req.params.word
    let regEx = new RegExp(word, 'i')
    Producto.find({ nombre : regEx})
        .populate('categoria','nombre')
        .exec((err,producto)=> {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message:
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
        })



app.post('/producto', auth, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        categoria: body.categoria,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.put('/producto/:id', auth, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true

    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

app.delete('/producto/:id', [auth], (req, res) => {
    let id = req.params.id;
    let cambio = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambio, {
        new: true,
    }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (productoBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    })
});






module.exports = app;