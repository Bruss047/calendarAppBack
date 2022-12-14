const {response} = require('express'); //reutiliza la libreria que ya fue cargada. En este caso response se utiliza para tener el autocompletado.
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');


const crearUsuario = async (req, res = response)=>{

    const {email, password} = req.body;
    try {
    
    let usuario = await Usuario.findOne({email});

    if(usuario){
        return res.status(400).json({
            ok:false,
            msg:'Correo ya registrado'
        });
    }

    usuario = new Usuario(req.body);
    
    //Encriptar contraseña:
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //Generar JWT:
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
        ok:true,
        uid: usuario.id,
        name: usuario.name,
        token

    })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error'
        })
    }
    
}

const loginUsuario = async (req, res = response)=>{

    const { email, password} = req.body;
    
    try {
        const usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'No existe un usuario con ese email.'
            });
        }

        //Confirmar Password:
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){

           return res.status(500).json({
            ok:false,
            msg:'Contraseña incorrecta.'
        });
        }

        //Generar JWT:
        const token = await generarJWT(usuario.id, usuario.name);

         res.status(201).json({
            ok:true,
            uid: usuario.id,
            name:usuario.name,
            token
        })


    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error'
        })
    }
    
    
}

const revalidarToken = async (req, res = response)=>{

    // const uid=req.uid;
    // const name=req.name;
    const {uid, name} = req;
    
    const token = await generarJWT(uid, name);

    res.json({
        ok:true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}