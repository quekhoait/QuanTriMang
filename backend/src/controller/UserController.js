const { pool } = require("../../db")
const jwt = require('jsonwebtoken');
const UserServices = require('../services/UserServices')
const JwtServices = require("../services/jwtServices")

const createUser = async(req, res)=>{
  try{
    const {email, username, password} = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isCheckEmail = emailRegex.test(email)
    if(!email || !username || !password ){
      return res.status(400).json({
        status: "ERR",
        message: "Bạn cần nhập đầy đủ thông tin"
      })
    }
     if(password.length < 6){
      return res.status(400).json({
        status: "ERR",
        message: "Mật khẩu phải dài hơn 6 ký tự" 
      })
    }
    if(!isCheckEmail){
      return res.status(400).json({
          status: 'ERR',
          message:'Email không hợp lệ'
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
      res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            samesite:'strict'
        })
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

const getUser  =async(req, res)=>{
  try{
    const id = req.user.id;
    const user = await UserServices.getUser(id);
    return res.status(200).json(user);
  }catch(err){
    return res.status(404).json({message: err.message})
  }
}

const getUserEmail  =async(req, res)=>{
  try{
    const email = req.params.email;
    const user = await UserServices.getUserEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    return res.status(200).json(user);
  }catch(err){
    return res.status(404).json({message: err.message})
  }
}

const refreshToken = async(req, res)=>{
  try{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, data)=>{
      if(err) res.sendStatus(403)
        const accessToken = jwt.sign({id: data.id}, process.env.ACCESS_TOKEN,{expiresIn: '3600s'})
      res.json({accessToken})
    })
  }catch(err){
    console.error('Refresh token verification error:', err.message);
    return res.sendStatus(403);
  }
}

const updateUser = async(req, res)=>{
    try{
        const userId = req.params.id
        const data = req.body;
        const file = req.file;
        if(file){
            data.avatar = `${process.env.API_BACKEND}/uploads/avatar/${file.filename}`;
        }
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'Không tìm thấy user'
            })
        }
        const user = await UserServices.updateUser(userId, data);
        return res.status(200).json(user);
    }catch(e){
        return res.status(404).json({message:'Cập nhật thất bại'})
    }
}

const logoutUser = async(req, res)=>{
  try{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(203);
    res.clearCookie('refreshToken', {
        httpOnly: true,
        samesite: 'strict',
        secure: false
    })
    return res.sendStatus(200);
  }catch(e){
      return res.status(500).json({ message: 'Đăng xuất thất bại' });
  }
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    getUserEmail,
    refreshToken,
    updateUser,
    logoutUser
}