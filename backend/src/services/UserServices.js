const { DateTime } = require("mssql");
const { pool } = require("../../db");
const bcrypt = require('bcrypt');

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.connect();
      const checkEmailUser = await pool
        .request()
        .input("email", newUser.email)
        .query("SELECT * FROM Account WHERE email = @email");

      if (checkEmailUser.recordset.length > 0) {
        resolve({
          status: "ERR",
          message: "Email đã tồn tại",
        });
      } 

      const checkUsername = await pool
        .request()
        .input("username", newUser.username)
        .query("SELECT * FROM Account WHERE username = @username");

      if (checkUsername.recordset.length > 0) {
        return resolve({
          status: "ERR",
          message: "Tên user đã tồn tại",
        });
      }
      const hashPass = await bcrypt.hash(newUser.password, 10);
        await pool
          .request()
          .input("email", newUser.email)
          .input("username", newUser.username)
          .input("password", newUser.password)
          .input("createDate", new DateTime() )
          .input("avatar","http://localhost:5999/uploads/avatar/user.png" )
          .query("INSERT INTO Account (email, username, password, createDate, avatar) VALUES (@email, @username, @password, @createDate, @avatar)");

        return resolve({
          status: "SUCCESS",
          message: newUser.message,
        });
      }
    catch (err) {
      reject(err);
    }
  });
};

const loginUser =(user)=>{
  return new Promise(async(resolve, reject)=>{
    try{
      await pool.connect();
      const checkUser = await pool
        .request().input("username", user.username)
        .input("password", user.password)
        .query("Select * from Account where username = @username and password = @password");
      if(checkUser.recordset.length === 0){
        resolve({
          status: "ERR",
          message: "Tên đăng nhập hoặc mật khẩu không đúng"
        })
      }
      const userInfo = checkUser.recordset[0]; // lấy user đầu tiên
        resolve({
          status: "SUCCESS",
          message: "Đăng nhập thành công",
          user: {
            id: userInfo.id,
            username: userInfo.username,
            isAdmin: userInfo.isAdmin
          }
        })
      
    }catch(err){
      reject(err);
    }
  })
}

const getUser = (id)=>{
  return new Promise(async(resolve, reject)=>{
    try{
      await pool.connect();
      const user = await pool.request().input('id', id).query("Select * from Account Where id = @id");
      if(user.recordset.length===0){
        return resolve({
          status: "ERR",
          message: "Không tìm thấy"
        })
      } 
      resolve({
          status: "ok",
          message: "Đã tìm thấy",
          data: user.recordset[0]
        })

    }catch(err){
      reject(err);
    }
  })
}

const getUserEmail = (email)=>{
  return new Promise(async(resolve, reject)=>{
    try{
      await pool.connect();
      const user = await pool.request().input('email', email).query("Select * from Account Where email = @email");
      if(user.recordset.length===0){
        return resolve({
          status: "ERR",
          message: "Không tìm thấy"
        })                                        
      } 
      resolve({
          status: "ok",
          message: "Đã tìm thấy",
          data: user.recordset[0]
        })

    }catch(err){
      reject(err);
    }
  })
}

const updateUser = (id, data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            await pool.connect();
            const user = await pool.request().input("id", id).query("Select * from Account Where id = @id")
            if(user.recordset.length === 0){
              return resolve({
                status: "ERR",
                message: "Không tìm thấy user"
              })
            }
            const existingUser = user.recordset[0];
            let passwordToUpdate = existingUser.password;
            if(data.password){
              passwordToUpdate = await bcrypt.hash(data.password, 10);
            }
            const updatedUser = await pool.request()
            .input("id", id)
            .input("username", data.username || existingUser.username)
            .input("password", data.password || existingUser.password)
            .input("avatar", data.avatar ||  existingUser.avatar)
            .input("role", data.role || existingUser.role)
            .input("email", data.email || existingUser.email)
            .query(`UPDATE Account SET
              username = @username,
              email = @email,
              password = @password,
              avatar = @avatar,
              role = @role
          WHERE id = @id`)

          resolve({
              status: 'OK',
              message: 'SUCCESS'
          })
        }catch(e){
            console.error('Update User Error:', e); // 👈 thêm dòng này
            reject(e)
        }
    })
}


module.exports = {
  createUser,
  loginUser,
  getUser,
  getUserEmail,
  updateUser
};
