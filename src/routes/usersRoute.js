import {Router } from 'express';
import userAuth from '../utils/userAuth.js';
import { getUserData, signIn, signUp } from "../controllers/usersController.js";
import { validateCreateUser } from '../middlewares/usersMiddleware.js';

const route = Router();

route.get('/users/me', userAuth, getUserData);
route.post('/signup', validateCreateUser, signUp);
route.post("/signin", signIn);

export default route;