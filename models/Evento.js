const {Schema, model} = require('mongoose');

const EventoSchema = Schema({

    title: {
        type: String,
        required:true
    },
    notes:{
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, //setea una referencia al objeto Usuario.
        ref: 'Usuario',
        required:true
    }
   

});

EventoSchema.method('toJSON',function(){ //modifica como se va a ver la informacion actuando en el 'toJSON'.
    const {__v, _id, ...object} = this.toObject();
    object.id=_id;
    return object;
})

module.exports = model('Evento', EventoSchema);