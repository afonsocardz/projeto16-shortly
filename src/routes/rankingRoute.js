import {Router} from 'express';
import getRanking from '../controllers/rankingController.js';

const route = Router();

route.get('/', getRanking);

export default route;