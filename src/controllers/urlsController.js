import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { urlRepository } from "../repositories/urlRepository.js";

async function urlShorten(req, res) {
  const userId = res.locals.userId;
  const { url } = res.locals.url;
  try {
    const shortUrl = nanoid();
    const today = dayjs().format('YYYY-MM-DD');
    await urlRepository.createShortenUrl(url, shortUrl, userId, today);
    res.status(201).send({ shortUrl });
  } catch (err) {
    res.status(500).send('urlShorten: \n' + err);
  }
};

async function deleteUrl(req, res) {
  const userId = res.locals.userId;
  const { id } = req.params;
  try {
    const url = await urlRepository.getUrlById(id);
    if (!url) {
      return res.sendStatus(404);
    }
    if (url.userId != userId) {
      return res.sendStatus(401);
    }
    await urlRepository.deleteUrl(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function redirect(req, res) {
  const { shortUrl } = req.params;
  try {
    const url = await urlRepository.getUrlByShortUrl(shortUrl);
    if (!url) {
      return res.sendStatus(404);
    }
    const today = dayjs().format('YYYY-MM-DD');
    await urlRepository.updateVisits(url);
    res.redirect(url.url)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const url = await urlRepository.getUrlById(id);
    if (!url.shortUrl) {
      return res.sendStatus(404);
    }
    res.status(200).send(url);
  } catch (err) {
    res.status(500).send('getUrlById: \n' + err);
  }
}

export { urlShorten, getUrlById, redirect, deleteUrl };