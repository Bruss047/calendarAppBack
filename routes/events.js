/*
    Rutas de Usuarios / Auth,
    host + /api/events
*/

const {Router} = require('express');
const router = Router();
const {validarJWT} = require('../middlewares/validar-jwt');
const {getEventos, crearEvento, actualizarEvento, eliminarEvento} = require ('../controllers/events');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {isDate} = require('../helpers/isDate');

router.use(validarJWT)

router.get('/', getEventos);

router.post('/',[
            check('title','El titulo es obligatorio').not().isEmpty(),
            check('start','Fecha de inicio obligatoria').custom(isDate),
            check('end','Fecha de finalización obligatoria').custom(isDate),
            validarCampos
        ], crearEvento);

router.put('/:id',[
            check('title','El titulo es obligatorio').not().isEmpty(),
            check('start','Fecha de inicio obligatoria').custom(isDate),
            check('end','Fecha de finalización obligatoria').custom(isDate),
            validarCampos
        ], actualizarEvento);

router.delete('/:id', eliminarEvento);


module.exports = router;