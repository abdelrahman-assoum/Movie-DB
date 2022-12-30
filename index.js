const express = require('express');
const app = express();
const PORT = 3000;
const currentTime = new Date().toLocaleTimeString([], { hour12: false });
app.get('/', (req, res) => {
    res.send('ok')
  });

app.get('/test', (req, res) => {
    res.json({status:200, message:"ok"})
})
app.get('/time', (req, res) => {
    res.send({status:200, message:`${currentTime}`});
  });

app.listen(PORT);