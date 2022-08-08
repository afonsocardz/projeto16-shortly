import {Router} from 'express';
import userAuth from '../utils/userAuth.js';
import { deleteUrl, getUrlById, redirect, urlShorten } from '../controllers/urlsController.js';
import { validateUrl } from '../middlewares/urlsMiddleware.js';

const route = Router();

route.delete('/:id', userAuth, deleteUrl);
route.post('/shorten' , userAuth, validateUrl, urlShorten);
route.get('/:id', getUrlById);
route.get('/open/:shortUrl', redirect);

export default route;