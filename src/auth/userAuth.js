import * as jwt from './serviceAuth.js';

function userAuth (req, res, next){
  const {authorization} = req.headers
  const token = authorization?.replace('Bearer ', '');
  console.log(authorization)
  const userId = jwt.verify(token);
  console.log(userId);
  if(!userId){
    return res.sendStatus(401);
  }
  res.locals.userId = userId;
  next();
}

export default userAuth;