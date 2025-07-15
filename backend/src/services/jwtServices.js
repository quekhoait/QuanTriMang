const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const genneralAccesToken  =(payload)=>{
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN,{expiresIn: '1min'})
  return accessToken
}

const genneralRefreshToken = (payload)=>{
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: '365d'})
  return refreshToken
}

module.exports = {
  genneralAccesToken,
  genneralRefreshToken
}