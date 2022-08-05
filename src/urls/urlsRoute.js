import {Router} from 'express';
import userAuth from '../auth/userAuth.js';
import { getUrlById, urlShorten } from './urlsController.js';
import { validateUrl } from './urlsMiddleware.js';

const route = Router();

route.post('/shorten' , userAuth, validateUrl, urlShorten);
route.get('/:id', getUrlById);

export default route;