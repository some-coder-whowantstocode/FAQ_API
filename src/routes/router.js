const express = require('express');
const { create, get, update, deleteall, deleteone } = require('../controllers/controller.js');

const router = express.Router();

router.post('/create', create);
router.get('/get', get);
router.put('/update/:id', update);
router.delete('/deleteall', deleteall);
router.delete('/deleteone/:id', deleteone);

module.exports = router;
