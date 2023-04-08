The initialization of the project:
1. Initialized the project with `npm init`
2. Installed neccessary packages `npm install express body-parser md5 sqlite3 --save`

**Install node if you do not have it.** 

How to run:
1. Run `npm install` on root project directory
2. Run `npm run start` from the root project directory
3. Open or install Postman and write API endpoint like `http://localhost:8000/api/v1/movies` and for other request
4. For GET request you can use web browser by URL like `http://localhost:8000/api/v1/movies`
5. For POST, DELETE and PUT: 
  Open Postman, choose POST, DELETE or PUT method
  Open `Headers` and add a header `Content-Type` set to `application/json`
  Add url as described below, for example `http://localhost:8000/api/v1/movies` and open `Body`, choose `x-www-form-urlencoded` and insert body data for each request and click `Send` button and you will see the result
6. Or alternatively, you can run using command line: `curl -d "name=test&description=test&director=test&year=2020&genre=something&rating=8.7&duration=135" -X POST http://localhost:8000/api/v1/movies` and you will get the response there directly


**All your data created, updated or deleted will be saved locally in DB using sqlite3**

Questions:
- GET  /api/v1/movies
  - 어떤 Query가 가능할까요?
The GET /api/v1/movies endpoint supports a name query parameter that allows the client to search for movies by name. The value of the name parameter is used as a wildcard search pattern on the name column of the movies table using the LIKE operator. For example, a client could send a GET request to /api/v1/movies?name=interstellar to search for movies with "interstellar" in the name.
  - 성공적인 경우, 어떤 https status code와 결과를 되돌려 줘야 할까요?
If the endpoint is successful in retrieving one or more movie objects from the database, it should return a 200 OK status code and an array of movie objects in the response body. The movie objects should have the same structure as the rows in the movies table.
  - 만약 Query를 던졌는데 내용이 없다면 어떤 https status code와 결과를 되돌려 줘야 할까요?
If the name query parameter is present but has no value, indicating that the client wants to search for all movies, the endpoint should return a 200 OK status code and an array of all movie objects in the response body. If the name parameter is not present at all, the endpoint should return a 404 Bad Request status code and an error message in the response body. If the endpoint is unable to find any movies that match the search query, it should return a 404 Not Found status code and an error message in the response body.
- GET /api/v1/movies/{movie_id}
  - In case of a successful retrieval of the movie, the server should respond with an HTTP status code of 200 OK. The response body should contain a JSON object that represents the movie, including its id, name, description, director, year, genre, rating, and duration. If there is no movie with the specified movie_id, the server should respond with an HTTP status code of 404 Not Found. The response body can contain a JSON object with an error message indicating that the requested movie was not found.
- POST /api/v1/movies
  - It receives a request body with all the data neccessary for creating a row. The sample is as follows, here rating is float number, year and duration(in minutes) are integer:
  `{
  "name": "random name",
  "description": "Some description",
  "director": "Some director",
  "year": 2019,
  "genre": "comedy",
  "rating": 8.7,
  "duration": 140
  }`
  - it checks if a movie with the same name already exists in the database by executing a SQL query. If such a movie exists, the server responds with an HTTP status code of 409 Conflict, along with a JSON error message indicating that a movie with the same name already exists. 
  - If no movie with the same name exists, the server inserts the new movie into the database using a parameterized SQL insert statement. If the insert operation encounters an error, the server responds with an HTTP status code of 500 Internal Server Error. Otherwise, the server responds with an HTTP status code of 201 Created, along with a JSON object that represents the newly created movie.
- PUT /api/v1/movies/{movie_id}
  - It receives a request body with all the data neccessary for updating a movie. The sample is as follows:
  `{
  "name": "random name changed",
  "description": "Some description changed",
  "duration": 145
  }`
  - If the update is successful, it returns the 200 OK status code and the message that the update was successful. Therefore, it returns `res.status(200).json({ message: 'Movie updated successfully' })` along with the updated data of movie.
  - If the body of the update request is not valid, an error message indicating that the request is invalid returned with a 400 Bad Request status code. Therefore, it returns `res.status (400).Returns json ({error: 'Invalid request body' })`.
- DELETE /api/v1/movies/{movie_id}
  - If the entity is successfully deleted, the server should respond with an HTTP status code of 200, message and data that was deleted.
  - If the entity to be deleted does not exist, the server should respond with an HTTP status code of 404 (Not Found) and an error message in the response body indicating that the entity does not exist.


