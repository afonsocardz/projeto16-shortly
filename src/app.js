import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoute from './users/usersRoute.js';
import urlsRoute from './urls/urlsRoute.js';
import rankingRoute from './ranking/rankingRoute.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(json());
app.use(cors());

app.use('/users', usersRoute);
app.use('/urls', urlsRoute);
app.use('/ranking', rankingRoute);

app.listen(PORT, () =>{
  console.log(`server is running on port ${PORT}`);
})