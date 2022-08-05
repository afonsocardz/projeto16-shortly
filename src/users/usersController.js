import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import * as jwt from '../auth/serviceAuth.js';
import connection from '../utils/databases/postgres.js';

async function getUserData(req, res) {
  const userId = res.locals.userId;

  const { rows: linkVisits } = await connection.query(`
  SELECT
    links.id AS "urlId",
    links."shortUrl" as "shortUrl",
    links.url AS url,
    count(visitants."linkId") AS "visitCount"
  FROM
    users
    JOIN links ON links."userId" = users.id
    JOIN visitants ON visitants."linkId" = links.id
  WHERE
    users.id = $1
  GROUP BY
    "urlId",
    "shortUrl",
    links.url;
  `, [userId]);

  const { rows: [totalVisits] } = await connection.query(`
  SELECT
    users.id AS id,
    users.name AS name,
    count(visitants."linkId") AS "visitCount"
  FROM
    users
    JOIN links ON links."userId" = users.id
    JOIN visitants ON visitants."linkId" = links.id
  WHERE
    users.id = $1
  GROUP BY
    users.id,
    users.name;
  `, [userId]);

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
    await connection.query(`
    INSERT INTO
      users (name, email, password, "createAt")
    VALUES
      ($1, $2, $3, $4)`,
      [user.name, user.email, user.password, today]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send('signup: \n' + err);
  }
}

async function signIn(req, res) {
  const login = req.body;
  try {
    const { rows: [findUser] } = await connection.query(`
    SELECT
      id,
      PASSWORD
    FROM
      users
    WHERE
      email = $1;
    `, [login.email]);
    
    const validPassword = bcrypt.compareSync(login.password, findUser.password);

    if (!findUser || !validPassword) {
      return res.sendStatus(401);
    }
    const token = jwt.signToken(findUser.id);
    res.status(200).send(token);
  } catch (err) {
    res.status(500).send("signIn: \n" + err);
  }
}

export { signIn, signUp, getUserData };