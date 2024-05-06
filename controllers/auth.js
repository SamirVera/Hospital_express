
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({

                ok: false,
                msg: 'Email no válida'
            })
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {

            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            })
        }

        const token = await generarJWT(usuarioDB.id);

        return res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        })


    }
}


module.exports = {
    login
}