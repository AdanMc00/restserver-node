//
// VERIFICAR TOKEN
//
const jwt = require('jsonwebtoken');

let auth = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario
        next();
    })

}

//
// verficaAdminRole
//

let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

}


//
// VERIFICAR TOKENIMG
//
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario
        next();
    })

}


module.exports = {
    auth, verificarAdminRole,verificaTokenImg
}