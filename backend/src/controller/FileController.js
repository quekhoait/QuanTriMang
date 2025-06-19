const { pool } = require("../../db")
const jwt = require('jsonwebtoken');

const createFolder = async(req, res)=>{
    try{
      const {folderName, userId, createDate} = req.body;
      const newwFolder= await FileServices.createFolder(req.body);
      if(newwFolder.status = "ERR"){
        return res.status(404).json(newwFolder)
      }
      res.status(200).json(newwFolder)
    }catch(err){
      return res.status(500).json({message: err.message})
    }
}

const uploadFile = async(req, res)=>{

}

module.exports = {
  uploadFile,
  createFolder
}