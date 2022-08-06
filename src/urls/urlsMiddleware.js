import Url from "./Url.js";

async function validateUrl (req, res, next){
  const url = req.body;
  try {
    const {error} = Url.validate(url);
    if (error){
      return res.sendStatus(422);
    }
    res.locals.url = url;
    next();
  } catch (err) {
    res.status(500).send('validateUrl: \n' + err);
  }
}

export { validateUrl };