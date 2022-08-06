import joi from 'joi';

const Url = joi.object({
  url: joi.string()
    .uri()
    .required(),
})

export default Url;