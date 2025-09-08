const express = require('express');

const app = express();
const PORT = 3000;

app.use("/",require('./src/routes/FileRouter'));

app.get('/', (req, res) => {
  res.send('Hello Backend Node.js!');
});

app.listen(PORT,'0.0.0.0', () => {
  console.log('Server is running on http://172.16.3.100:${PORT}');
});
