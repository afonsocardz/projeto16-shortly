import { rankingRepository } from "../repositories/rankingRepository.js";

async function getRanking(req, res) {
  try {
    const ranking = await rankingRepository.getUsersRanking();
    res.status(200).send(ranking);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export default getRanking;