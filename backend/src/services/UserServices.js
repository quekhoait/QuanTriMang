const { pool } = require("../../db");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.connect();
      const checkUser = await pool
        .request()
        .input("username", newUser.username)
        .query("SELECT * FROM Account WHERE username = @username");

      if (checkUser.recordset.length > 0) {
        resolve({
          status: "ERR",
          message: "Tên đã tồn tại",
        });
      } else {
        await pool
          .request()
          .input("username", newUser.username)
          .input("password", newUser.password)
          .query("INSERT INTO Account (username, password) VALUES (@username, @password)");

        resolve({
          status: "SUCCESS",
          message: newUser.message,
        });
      }
    } catch (err) {
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


module.exports = {
  createUser,
  loginUser
};
