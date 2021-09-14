const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) =>{

    //x-token headers
    const token = req.header('x-token');


    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        ); //la firma también va a constatar de que el Payload no haya sido modificado.
                 
        req.uid= uid; //Se modifica la request que va a ser pasada por referencia a la función subsiguiente a "next()"
        req.name= name;

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no válido.'
        });
    }

    next();

}

module.exports = {
    validarJWT
}