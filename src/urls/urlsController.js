import dayjs from "dayjs";
import { nanoid } from "nanoid";
import connection from "../utils/databases/postgres.js";

async function urlShorten(req, res) {
  const userId = res.locals.userId;
  const { url } = res.locals.url;
  try {
    const shortUrl = nanoid();
    const today = dayjs().format('YYYY-MM-DD');
    await connection.query(`
      INSERT INTO
        links (url, "shortUrl", "userId", "createAt")
      VALUES
        ($1, $2, $3, $4)
    `, [url, shortUrl, userId, today]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send('urlShorten: \n' + err);
  }
};

export { urlShorten };