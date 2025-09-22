const express = require("express");
const { pool, poolConnect } = require("./db"); // Không cần `sql` ở đây
const routes = require("./src/routes");
const path = require('path')
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5999;



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors'); //kết nối db
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

//gửi ảnh qua font-end
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
routes(app)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


