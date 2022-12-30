const express = require('express');
const app = express();
const PORT = 3000;
const currentTime = new Date().toLocaleTimeString([], { hour12: false });

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

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
  
    app.get("/movies/create", (req, res) => {    
    res.json({message: "create"});
})

    app.get("/movies/read", (req, res) => {
    res.json({status:200, data: movies});
})

    app.get("/movies/update", (req, res) => {
    res.json({message: "update"});
})

    app.get("/movies/delete", (req, res) => {
    res.json({message: "delete"})
})
    
    app.get("/movies/read/by-date", (req, res) => {
    const sortedByDate = movies.sort((a, b) => a.year - b.year);
    res.json({status: 200, data: sortedByDate});
  });

    app.get("/movies/read/by-rating", (req, res) => {
    const sortedByRating = movies.sort((a, b) => b.rating - a.rating);
    res.json({status: 200, data: sortedByRating});
  });

  app.get("/movies/read/by-title", (req, res) => {
    const sortedByTitle = movies.sort((a,b) => (a.title > b.title) - (b.title > a.title));
    res.json({ status: 200, data: sortedByTitle });
})

app.get('/movies/read/id/:id', (req, res) => {
  const id = req.params.id;
  const movie = movies[id - 1];
  if (movie) {
      res.status(200).json({ status: 200, data: movie })
  } else {
      res.status(404).json({ status: 404, error: true, message: `the movie ${id} does not exist` })
  }
});

app.listen(PORT);