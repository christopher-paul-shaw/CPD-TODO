// Requirements
const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();

// Configuration
app.set("view engine", "ejs"); // Enable View Engine
app.use("/static", express.static("public")); // Enable Stylesheet / Static Content
app.use(express.urlencoded({ extended: true })); // Enable extracting form dtaa from the request body (POST)

// Resources
let db = new sqlite3.Database('./database/db.sqlite', (err) => {
	if (err) {
	  return console.error(err.message);
	}
});

// Routing
app.get('/',(req, res) => {
  db.all("SELECT * FROM items WHERE completed = 0", (error, rows) => {
	res.render('todo.ejs',{ tasks: rows, page: "index" });
  });
});

app.get('/completed',(req, res) => {
	db.all("SELECT * FROM items WHERE completed = 1", (error, rows) => {
	  res.render('todo.ejs',{ tasks: rows, page: "completed" });
	});
});
  
app.post('/',(req, res) => {
	// Validate
	if (!req.body.content) {
		res.redirect("/");
		return;
	}

	db.run("INSERT INTO items (name, completed) VALUES (?,0)", req.body.content);
	
	res.redirect("/");
});

app.get("/complete/:id",(req, res) => {
	db.run("UPDATE items SET completed = 1 WHERE id = ?", req.params.id);
	res.redirect("/");
});

app.get("/remove/:id",(req, res) => {
	db.run("DELETE FROM items WHERE id = ?", req.params.id);
	res.redirect("/");
});

// Enable Server
app.listen(3000, () => console.log("Server Up and running"));
