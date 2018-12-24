import express from 'express';
import { createUser, loginUser, getAllUsers, getUser } from '../controllers/userController';

const router = express.Router();
const auth = require('../controllers/authController');
const content = require('../controllers/contentController');
const middleware = require('../services/middlewareService');

// Content endpoint
router.post('/playlist', middleware.authorisation, content.create);
router.get('/playlist', content.getAll);
router.get('/playlist/:listObjectId', content.getOne); // getOne is not refactored yet
router.patch('/playlist/:listObjectId', middleware.authorisation, content.update);
router.delete('/playlist/:listObjectId', middleware.authorisation, content.delete);

// User endpoint
router.post('/user/signup', auth.signUp);
router.post('/user/login', auth.signIn);
router.get('/user', getAllUsers);
router.get('/user/:userId', getUser);

// Admin endpoint
router.post('/admin/auth', auth.verifyAdmin);

router.post("/refreshToken", auth.getNewAccessPair);
// router.post("/exchangeSignInToken", auth.getAccessPairForNewUser);
// router.get("/logOut",auth.logOut);

module.exports = router;