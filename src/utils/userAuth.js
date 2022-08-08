import * as jwt from '../services/serviceAuth.js';

function userAuth (req, res, next){
  const {authorization} = req.headers
  const token = authorization?.replace('Bearer ', '');
  const userId = jwt.verify(token);
  if(!userId){
    return res.sendStatus(401);
  }
  res.locals.userId = userId;
  next();
}

export default userAuth;