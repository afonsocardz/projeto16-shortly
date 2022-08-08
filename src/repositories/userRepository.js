import connection from '../utils/databases/postgres.js';

async function getLinkCount(userId) {
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
  return linkVisits;
}

async function getUserTotalVisits(userId) {
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
  return totalVisits;
}

async function createUser({ name, email, password }, today) {
  await connection.query(`
    INSERT INTO
      users (name, email, password, "createAt")
    VALUES
      ($1, $2, $3, $4)
    `,
    [name, email, password, today]
  );
  return true;
}

async function userSignIn(email) {
  const { rows: [findUser] } = await connection.query(`
    SELECT
      id,
      PASSWORD
    FROM
      users
    WHERE
      email = $1;
    `, [email]);
  return findUser;
}

export const userRepository = {
  getLinkCount,
  getUserTotalVisits,
  createUser,
  userSignIn,
};