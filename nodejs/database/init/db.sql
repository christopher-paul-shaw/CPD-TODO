CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,
  name TEXT DEFAULT "",
);

INSERT INTO items
  (name, desc, completed) 
VALUES 
  ("Activity 1", "Produce An Applciation in NodeJS", 1),
  ("Code Review 1 ", "Review The Application", 0);
