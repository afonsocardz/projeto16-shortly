import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import * as jwt from '../services/serviceAuth.js';
import { userRepository } from '../repositories/userRepository.js';

async function getUserData(req, res) {
  const userId = res.locals.userId;

  const linkVisits = await userRepository.getLinkCount(userId);
  const totalVisits = await userRepository.getUserTotalVisits(userId);

  const userData = {
    ...totalVisits,
    shortnedUrls: [
      ...linkVisits
    ]
  }
  res.status(200).send(userData);
}

async function signUp(req, res) {
  const user = res.locals.user;
  const today = dayjs().format('YYYY-MM-DD');
  try {
    await userRepository.createUser(user, today)
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send('signup: \n' + err);
  }
}

async function signIn(req, res) {
  const login = req.body;
  try {
    const findUser = await userRepository.userSignIn(login.email);
    if (!findUser) {
      return res.sendStatus(401);
    }
    const validPassword = bcrypt.compareSync(login.password, findUser.password);
    if (!validPassword) {
      return res.sendStatus(401);
    }
    const token = jwt.signToken(findUser.id);
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("signIn: \n" + err);
  }
}

export { signIn, signUp, getUserData };