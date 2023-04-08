var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            director TEXT NOT NULL,
            year INTEGER NOT NULL,
            genre TEXT,
            rating REAL,
            duration INTEGER
        )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                // var insert = 'INSERT INTO movies (name, description, director, year, genre, rating, duration) VALUES (?, ?, ?, ?, ?, ?, ?)'
                // db.run(insert, ["Two Guns", "About two guns and guys", "Dude", 2020, "detective", 8.7, 150])
                // db.run(insert, ["Catch Me If You Can", "Barely 21 yet, Frank is a skilled forger who has passed as a doctor, lawyer and pilot. FBI agent Carl becomes obsessed with tracking down the con man, who only revels in the pursuit.", "Steven Spielberg", 2002, "comedy-drama", 8.1, 141])
                // db.run(insert, ["Creed 3", "Boxers and champions", "Guy Ritchie", 2017, "action", 9.3, 143])
            }
        });  
    }
});

module.exports = db