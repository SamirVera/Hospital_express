const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');
    console.log(usuarios);

    res.json({
        ok: true,
        usuarios,
    });
}


const createUsuarios = async (req, res) => {
    console.log(req.body);
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });   
        console.log(existeEmail, 'aqui esta ');
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'

            })
        }
        const usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}


const updateUsario = async (req, res) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            })
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese emails'
                })
            }

            campos.email = email;
            const usuarioUpdated = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


            res.json({
                ok: true,
                usuario: usuarioUpdated
            })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })

    }
}

const deleteUsuario = async (req, res) => {
    const uid = req.params.id;

    console.log(req);

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        return res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })


    }
}

module.exports = {
    getUsuarios,
    createUsuarios,
    updateUsario,
    deleteUsuario
}