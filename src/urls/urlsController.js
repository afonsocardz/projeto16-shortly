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
    res.status(201).send({ shortUrl });
  } catch (err) {
    res.status(500).send('urlShorten: \n' + err);
  }
};

async function deleteUrl (req, res){
  const userId = res.locals.userId;
  const {id} = req.params;
  try {
    const {rows: [url]} = await connection.query(`
      SELECT
        id,
        "userId"
      FROM
        links
      WHERE
        id = $1
    `, [id]);
    if(!url){
      return res.sendStatus(404);
    }
    if(url.userId != userId){
      return res.sendStatus(401);
    }
    await connection.query(`
      DELETE FROM visitants WHERE "linkId" = $1
    `, [id]);
    await connection.query(`
      DELETE FROM links WHERE id = $1
    `, [id]);
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function redirect(req, res) {
  const {shortUrl} = req.params;
  try {
    const {rows: [url]} = await connection.query(`
      SELECT
        id,
        url,
        "shortUrl"
      FROM
        links
      WHERE
       "shortUrl" = $1
    `, [shortUrl]);
    if(!url){
      return res.sendStatus(404);
    }
    const today = dayjs().format('YYYY-MM-DD');
    await connection.query(`
      INSERT INTO visitants
        ("visitDate", "linkId")
      VALUES
        ($1, $2)
    `, [today, url.id]);
    res.redirect(url.url)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const { rows: [url] } = await connection.query(`
      SELECT
        id,
        "shortUrl",
        url
      FROM
        links
      WHERE
        id = $1
    `, [id]);
    if (!url.shortUrl) {
      return res.sendStatus(404);
    }
    res.status(200).send(url);
  } catch (err) {
    res.status(500).send('getUrlById: \n' + err);
  }
}

export { urlShorten, getUrlById, redirect, deleteUrl };