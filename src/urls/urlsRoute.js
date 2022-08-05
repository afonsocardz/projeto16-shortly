import {Router} from 'express';
import userAuth from '../auth/userAuth.js';
import { urlShorten } from './urlsController.js';
import { validateUrl } from './urlsMiddleware.js';

const route = Router();

route.post('/shorten' , userAuth, validateUrl, urlShorten);

export default route;