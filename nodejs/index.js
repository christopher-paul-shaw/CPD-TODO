// Requirements
const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Configuration
app.set("view engine", "ejs"); // Enable View Engine
app.use("/static", express.static("public")); // Enable Stylesheet / Static Content
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Resources
let db = new sqlite3.Database('./database/db.sqlite', (err) => {
	if (err) {
	  return console.error(err.message);
	}
});

// Routing
app.get('/',(req, res) => {
  db.all("SELECT * FROM items WHERE completed = 0", (error, rows) => {
	res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  });
});

app.get('/completed',(req, res) => {
	db.all("SELECT * FROM items WHERE completed = 1", (error, rows) => {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(rows));
	});
});
  
app.post('/',(req, res) => {
	// Validate
	if (!req.body.item) {
		res.setHeader('Content-Type', 'application/json');
   		res.end(JSON.stringify({ "error": 1, "message": "Item can not be blank"}));
		return;
	}

	db.run("INSERT INTO items (name, completed) VALUES (?,0)", req.body.item);	
	res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "status": 1, "message": "Item Inserted"}));
});

app.post("/complete",(req, res) => {
	db.run("UPDATE items SET completed = 1 WHERE id = ?", req.body.id);
	res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "status": 1, "message": "Item Updated"}));
});

app.post("/remove",(req, res) => {
	db.run("DELETE FROM items WHERE id = ?", req.body.id);
	res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "status": 1, "message": "Item Removed"}));
});

// Enable Server
app.listen(3000, () => console.log("Server Up and running"));


















// close the database connection
/** db.close((err) => {
	if (err) {
	  return console.error(err.message);
	}
	console.log('Close the database connection.');
  });
  **/