import joi from 'joi';

const Url = joi.object({
  url: joi.string()
    .required(),
})

export default Url;