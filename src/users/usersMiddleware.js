import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connection from '../utils/databases/postgres.js';
import User from "./User.js";

dotenv.config();

async function validateCreateUser(req, res, next) {
  const user = req.body;
  try {
    const {rows: [findUser]} = await connection.query(`
      SELECT
        *
      FROM
        users
      WHERE
        email = $1
    `, [user.email]);
    const notEqual = user.password != user.confirmPassword;
    const { error } = User.validate(user);
    if (error || notEqual || findUser) {
      return res.sendStatus(422);
    }
    delete user.confirmPassword;
    const HASH_SALTS = Number(process.env.HASH_SALTS);
    const passwordHash = bcrypt.hashSync(user.password, HASH_SALTS);
    res.locals.user = {
      ...user,
      password: passwordHash,
    };
    
    next();
  } catch (err) {
    res.status(500).send('validateCreateUser: \n' + err);
  }
}

export { validateCreateUser };