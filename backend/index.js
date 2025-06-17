const express = require("express");
const { pool, poolConnect } = require("./db"); // Không cần `sql` ở đây
const routes = require("./src/routes");

const app = express();
const PORT = 3000;

app.use(express.json());
routes(app)


app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
