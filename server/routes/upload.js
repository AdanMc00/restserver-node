const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')
const app = express();
const Usuario = require('../models/user')
const Productos = require('../models/productos')
//default options

app.use(fileUpload({useTemplateFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.stats(400).json({
            ok: false,
            err: {
                message: 'No se seleccionado ningun archivo'
            }
        });
    }
    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo) < 0) {
        console.log(tipo)
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Tipo no permitido'
            }
        })
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no permitido',
                ext: extension
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            })
        }
        if(tipo === 'usuarios') {
            imagenUsuario(id,res, nombreArchivo)
        } else {
            imagenProducto(id,res,nombreArchivo)
        }


    })
})
function imagenUsuario(id,res, nombreArchivo) {

    Usuario.findById(id,(err,usuarioDB) => {
        if(err){
            borrarArchivo(nombreArchivo,'usuarios')
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borrarArchivo(nombreArchivo,'usuarios')
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img,'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado) => {
            res.json({
                ok:true,
                usuarioGuardado,
                img:nombreArchivo
            })
        })
    })
}
function imagenProducto(id, res, nombreArchivo){
    Productos.findById(id,(err,productoDB) => {
        if(err){
            borrarArchivo(nombreArchivo,'productos')
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            borrarArchivo(nombreArchivo,'productos')
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borrarArchivo(productoDB.img,'productos')

        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado) => {
            res.json({
                ok:true,
                productoGuardado,
                producto:productoGuardado,
                img:nombreArchivo
            })
        })
    })
}
function borrarArchivo(nombreImagen, tipo) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if( fs.existsSync( pathUrl)) {
        fs.unlinkSync(pathUrl)
    }
}
module.exports = app