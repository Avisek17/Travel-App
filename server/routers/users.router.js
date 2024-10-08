
// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { postUser,loginUser,logoutUser } = require('../controllers/users.controller');
// POST /api/signup
router.post('/signup', postUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);


module.exports = router;
