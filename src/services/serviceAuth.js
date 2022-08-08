import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

function signToken(userId) {
  const token = jwt.sign({id: userId}, TOKEN_SECRET);
  return token;
}

function verify(token) {
  try{
    console.log(jwt.verify(token, TOKEN_SECRET));
    const {id} = jwt.verify(token, TOKEN_SECRET);
    return id;
  }catch(err){
    console.log(err);
    return false;
  }
}

export { signToken, verify };