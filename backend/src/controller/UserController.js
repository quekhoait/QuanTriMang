const { pool } = require("../../db")
const UserServices = require('../services/UserServices')
const JwtServices = require("../services/jwtServices")

const createUser = async(req, res)=>{
  try{
    const {username, password, confirmPassword} = req.body;
    if(!username || !password || !confirmPassword){
      return res.status(400).json({
        status: "ERR",
        message: "Bạn cần nhập đầy đủ thông tin"
      })
    }
    if(confirmPassword!== password){
      return res.status(400).json({
        status: "ERR",
        message: "Mật khẩu xác nhận chưa đúng"
      })
    }
     if(password.length < 6){
      return res.status(400).json({
        status: "ERR",
        message: "Mật khẩu phải dài hơn 6 ký tự"
      })
    }
    const user = await UserServices.createUser(req.body);
    if (user.status === 'ERR') {
          return res.status(404).json(user);
      }
      res.status(200).json(user);
  }catch(err){
    return res.status(500).json({message: err.message})
  }
}

const loginUser = async(req, res)=>{
  try{
    const {username, password} = req.body;
    if(!username || !password) {
      return res.status(400).json({
        status: "ERR",
        message: "Nhập đầy đủ thông tin"
      })
    }
    const userLogin = await UserServices.loginUser(req.body);
    if(userLogin.status === 'ERR'){
      return res.status(404).json(userLogin);
    }
    const userData = {
      id: userLogin.user.id,
      isAdmin: userLogin.user.isAdmin
    }
    const accessToken = JwtServices.genneralAccesToken(userData);
    const refreshToken = JwtServices.genneralRefreshToken(userData);

    return res.status(200).json({
      status: "OK",
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: userLogin.user
    })
  }catch(err){
    return res.status(500).json({message: err.message})
  }
}

module.exports = {
    createUser,
    loginUser
}