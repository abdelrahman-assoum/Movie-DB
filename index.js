const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const url = "mongodb+srv://abdelrahmanassoum:codi1234567890@mongodbcluster0.1tcb09n.mongodb.net/?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);
async function connect() {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB")
  }
  catch (error) {
  console.error(error);
  }
}

connect()

let mySch = new mongoose.Schema({
  _id: {
      type: String,
      required: true
  },
  title: {
      type: String,
      required: true
  },
  year: { 
      type: Number,
      required: true,
      min: 1900,
      max: 2023,
  },
  rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 10,
  },
})

const moviesmodel = mongoose.model("moviesDB", mySch);
 
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]


app.use(express.json())
app.get('/', (req, res) => {
    res.send('ok')
  });

app.get('/test', (req, res) => {
    res.json({status:200, message:"ok"})
})
app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString([], { hour12: false });  
  res.json({status:200, message:`${currentTime}`});
  });

  app.get('/hello/:id?', (req, res) => {
    const id = parseInt(req.params.id) || 'user';
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
  
    app.post("/movies/create", (req, res) => {    
    res.json({message: "create"});
    });

    app.get("/movies/read", async(req, res) => {
      try {
        const DataBase = await moviesmodel.find()
        res.json({ status: 200, data: DataBase })
    } catch (error) {
        res.json({ status: 400, message: error.message })
    }
})

    app.patch("/movies/update", (req, res) => {
    res.json({message: "update"});
})

    app.delete("/movies/delete", (req, res) => {
    res.json({message: "delete"})
})
    
    app.get("/movies/read/by-date", (req, res) => {
      moviesmodel.find().sort({ year: 1 }).exec((err, Movies) => {
        if (err) {
            res.json({ status: 400, message: err })
        } else {
            res.json({ status: 200, data: Movies })
        }
    })
  });

    app.get("/movies/read/by-rating", (req, res) => {
      moviesmodel.find().sort({ rating: 1 }).exec((err, Movies) => {
        if (err) {
            res.json({ status: 400, message: err })
        } else {
            res.json({ status: 200, data: Movies })
        }
    })
  });

  app.get("/movies/read/by-title", (req, res) => {
    moviesmodel.find().sort({ title: 1 }).exec((err, Movies) => {
      if (err) {
          res.json({ status: 400, message: err })
      } else {
          res.json({ status: 200, data: Movies })
      }
  })
})

app.get('/movies/read/id/:id', (req, res) => {
  moviesmodel.findById(req.params.id, (error, movie) => {
    if (error) {
        return res.status(500).json({ status: 500, error: true, message: error });
    }
    if (!movie) {
        return res.status(404).json({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` });
    }
    else {
      res.status(200).json({ status: 200, data: movie });
    }
   
});
});

app.post("/movies/add", async(req, res) => {
  
  const title = req.query.title
  const year = req.query.year
  const rating = req.query.rating || 4 

  const newMovie = new moviesmodel ({

    _id:new mongoose.Types.ObjectId(),
    title:title,
    year:year,
    rating:rating,
  })
  try {
    const movie = await newMovie.save()
    res.json({status:200, data: movie})
  } catch (error) {
    res.json({status:404 , message:error})
  }
});

app.delete("/movies/delete/:id?", (req, res) => {
  const id = req.params.id
    moviesmodel.findOneAndDelete(({ _id: id }), (err, deleted) => {
        if (err) {
            return res.json({ status: res.statusCode, message: err })
        }
        if (deleted == null) {
            return res.json({ status: res.statusCode, message: `the movie ${id} does not exist` })
        } else {
            res.json({ status: res.statusCode, data: "The movie is deleted" })
        }
    })
  
});

app.patch("/movies/update/:id", (req, res) => {
  const id = req.params.id
    const newTitle = req.query.title
    const newYear = req.query.year
    const newRating = req.query.rating
    if (req.query.rating > 10 || req.query.rating < 0) {
        return res.json({ status: 403, error: true, message: 'you rating should be between 0 and 10' })
    }
    moviesmodel.findOneAndUpdate({ _id: id }, { $set: { title: newTitle, year: newYear, rating: newRating } }, { new: true },
        (err, updateData) => {
            if (err) {
                return res.json({ status: 404, message: err })
            }
            if (updateData == null) {
                return res.json({ status: 404, message: `the movie ${id} does not exist` })
            } else {
                res.json({ status: 200, data: updateData })
            }
        })
})

app.listen(PORT);