var express = require("express")
const bodyParser = require('body-parser');
var app = express()
var db = require("./database.js")

var HTTP_PORT = 8000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/", (req, res, next) => {
    res.json({"message":"Get, Add, Delete or Change movies using the corresponding APIs"})
});

app.get('/api/v1/movies', (req, res) => {
    const query = req.query.name || ''; // Get the value of the 'name' query parameter, or an empty string if it's not present
    const sql = `SELECT * FROM movies WHERE name LIKE '%${query}%'`; // Use search on the 'name' column with the 'LIKE' operator
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error' }); // Return a 500 Internal Server Error status code and an error message
      }
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No movies found' }); // Return a 404 Not Found status code and an error message
      }
  
      return res.status(200).json(rows); // Return a 200 OK status code and the array of movie objects
    });
});

app.get('/api/v1/movies/:movie_id', (req, res) => {
    const movieId = req.params.movie_id;
  
    db.get('SELECT * FROM movies WHERE id = ?', [movieId], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
        return;
      }
  
      if (!row) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
  
      res.status(200).json({
        id: row.id,
        name: row.name,
        description: row.description,
        director: row.director,
        year: row.year,
        genre: row.genre,
        rating: row.rating,
        duration: row.duration
      });
    });
});

app.post('/api/v1/movies', (req, res) => {
    const { name, description, director, year, genre, rating, duration } = req.body;
  
    // Validate input
    if (!name || !director || !year || !genre || !rating || !duration) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
  
    // Check if movie with the same name already exists
    db.get('SELECT * FROM movies WHERE name = ?', [name], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
        return;
      }
  
      if (row) {
        res.status(409).json({ error: 'A movie with the same name already exists' });
        return;
      }
  
      // Insert new movie into database
      const insertSql = 'INSERT INTO movies(name, description, director, year, genre, rating, duration) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.run(insertSql, [name, description, director, year, genre, rating, duration], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal server error');
          return;
        }
  
        const createdMovie = {
          id: this.lastID,
          name,
          description,
          director,
          year,
          genre,
          rating,
          duration
        };
  
        res.status(201).json({message: "Movie created successfully.", movie: createdMovie});
      });
    });
});

// Update a movie by id
app.put('/api/v1/movies/:movie_id', (req, res) => {
    const { movie_id } = req.params;
    const { name, description, director, year, genre, rating, duration } = req.body;
  
    const updateQuery = `
      UPDATE movies
      SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        director = COALESCE(?, director),
        year = COALESCE(?, year),
        genre = COALESCE(?, genre),
        rating = COALESCE(?, rating),
        duration = COALESCE(?, duration)
      WHERE id = ?`;
  
    db.run(updateQuery, [name, description, director, year, genre, rating, duration, movie_id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update movie.', error: err.message });
      }
      db.get(`SELECT * FROM movies WHERE id = ?`, [movie_id], function(err, row) {
        if (err) {
          return res.status(500).json({ message: 'Failed to get updated movie.', error: err.message });
        }
        if (!row) {
          return res.status(404).json({ message: 'Movie not found.' });
        }
        return res.status(200).json({ message: 'Movie updated successfully.', movie: row });
      });
    });
});  

app.delete('/api/v1/movies/:id', (req, res) => {
    const movieId = req.params.id;
  
    db.get('SELECT * FROM movies WHERE id = ?', [movieId], function (err, row) {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (!row) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      db.run('DELETE FROM movies WHERE id = ?', [movieId], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        return res.status(200).json({ message: 'Movie deleted successfully', deletedData: row });
      });
    });
});  

app.use(function(req, res){
    res.status(404);
});