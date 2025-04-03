const express = require('express');
const { getUserById, getAllUsers, createUser, deleteUser, updateUser } = require('../controllers/userController');
const router = express.Router();


router.get('/:id', getUserById);
router.get('/',getAllUsers)
router.post('/create',createUser)
router.post('/updateUser',updateUser)
router.delete('/:id',deleteUser)


module.exports = router;