const {response} = require('express'); //reutiliza la libreria que ya fue cargada. En este caso response se utiliza para tener el autocompletado.


const Evento = require('../models/Evento');



const getEventos = async(req, res = response)=>{

    const eventos = await Evento.find() //admite distintos filtros de busqueda.
                                .populate('user', 'name');

    res.status(200).json(
        {
            ok:true,
            eventos
        }
    )
}

const crearEvento = async (req, res = response)=>{
    

    const evento = new Evento (req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok:true,
            evento: eventoGuardado

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el admin.'
        });
    }

}

const actualizarEvento = async (req, res = response)=>{
    
    const eventoId = req.params.id;
    const uid = req.uid;
   

    try {
        const evento = await Evento.findById(eventoId);
        

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg: "No existe un evento con ese Id."
            })
        }
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'No tiene privilegio para editar este evento.'
            })
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true}); // {new: true} para que retorne los datos actualizados en Postman.

        res.json({
            ok:true,
            evento:eventoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el admin.'
        });
    }

}

const eliminarEvento = async(req, res = response)=>{

   
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese Id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }


        await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true,
                   msg: 'Evento eliminado.' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el admin.'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}