const express = require("express");
const { pool, poolConnect } = require("./db"); // Không cần `sql` ở đây
const routes = require("./src/routes");

const app = express();
const PORT = 5999;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
routes(app)




app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
