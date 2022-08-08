import connection from "../utils/databases/postgres.js";

async function getUrlById(id) {
  const { rows: [url] } = await connection.query(`
      SELECT
        *
      FROM
        links
      WHERE
        id = $1
    `, [id]);
  return url;
}

async function deleteUrl(id) {
  await connection.query(`
      DELETE FROM visitants WHERE "linkId" = $1
    `, [id]);
  await connection.query(`
      DELETE FROM links WHERE id = $1
    `, [id]);
}

async function getUrlByShortUrl(shortUrl) {
  const { rows: [url] } = await connection.query(`
      SELECT
        *
      FROM
        links
      WHERE
       "shortUrl" = $1
    `, [shortUrl]);
  return url;
}

async function createShortenUrl(url, shortUrl, userId, today){
  await connection.query(`
      INSERT INTO
        links (url, "shortUrl", "userId", "createAt")
      VALUES
        ($1, $2, $3, $4)
    `, [url, shortUrl, userId, today]);
}

async function updateVisits({ id }, today) {

  await connection.query(`
      INSERT INTO visitants
        ("visitDate", "linkId")
      VALUES
        ($1, $2)
    `, [today, id]);
}

export const urlRepository = {
  getUrlById,
  deleteUrl,
  getUrlByShortUrl,
  updateVisits,
  createShortenUrl,
};