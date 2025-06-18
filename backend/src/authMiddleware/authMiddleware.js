const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next)=>{
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) return res.sendStatus(402);
  jwt.verify(token,process.env.ACCESS_TOKEN,(err, data)=>{
    if(err) return res.sendStatus(404);
      req.user = data
      next();
  })
}

module.exports = {authMiddleware}