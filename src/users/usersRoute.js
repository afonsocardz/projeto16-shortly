import {Router } from 'express';
import userAuth from '../auth/userAuth.js';
import { getUserData, signIn, signUp } from "./usersController.js";
import { validateCreateUser } from './usersMiddleware.js';

const route = Router();

route.get('/me', userAuth, getUserData);
route.post('/signup', validateCreateUser, signUp);
route.post("/signin", signIn);

export default route;