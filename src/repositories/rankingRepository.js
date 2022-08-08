import connection from "../utils/databases/postgres.js";

async function getUsersRanking() {
  const { rows: ranking } = await connection.query(`
    SELECT
      users.id,
      users.name,
      count(links."userId") AS "linksCount",
      count(visitants."linkId") AS "visitCount"
    FROM
      users
      LEFT JOIN links ON links."userId" = users.id
      LEFT JOIN visitants ON visitants."linkId" = links.id
    GROUP BY
      users.id,
      users.name
    ORDER BY
      "visitCount" DESC
    LIMIT
      10;
  `);
  return ranking;
}

export const rankingRepository = {
  getUsersRanking,
}