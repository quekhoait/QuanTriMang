const express = require('express');

const app = express();
const PORT = 3000;

app.use("/",require('./src/routes/FileRouter'));

app.get('/', (req, res) => {
  res.send('Hello Backend Node.js!');
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});
