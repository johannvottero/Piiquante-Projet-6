const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('../middlewares/multer');

const stuffCtrl = require('../controllers/sauces');

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createSauces);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);

module.exports = router;