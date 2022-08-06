import {Router} from 'express';
import userAuth from '../auth/userAuth.js';
import { deleteUrl, getUrlById, redirect, urlShorten } from './urlsController.js';
import { validateUrl } from './urlsMiddleware.js';

const route = Router();

route.delete('/:id', userAuth, deleteUrl);
route.post('/shorten' , userAuth, validateUrl, urlShorten);
route.get('/:id', getUrlById);
route.get('/open/:shortUrl', redirect);

export default route;