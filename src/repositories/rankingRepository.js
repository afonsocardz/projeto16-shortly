import connection from "../utils/databases/postgres.js";

async function getUsersRanking() {
  const { rows: ranking } = await connection.query(`
    SELECT
      users.id,
      users.name,
      count(links."userId") AS "linksCount",
      sum("visitsCount") AS "visitCount"
    FROM
      users
      LEFT JOIN links ON links."userId" = users.id
    GROUP BY
      users.id
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