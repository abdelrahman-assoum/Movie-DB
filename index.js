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
    res.json({status:200, message:`${currentTime}`});
  });

  app.get('/hello/:id?', (req, res) => {
    const id = req.params.id || 'user';
    res.json({ status: 200, message: `Hello, ${id}` });
  });

  app.get('/search', (req, res) => {
    const search = req.query.s;
    if (search) {
      res.json({ status: 200, message: 'ok', data: search });
    } else {
      res.status(500).json({ status: 500, error: true, message: 'you have to provide a search' });
    }
  });
  
app.listen(PORT);