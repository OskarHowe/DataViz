require("dotenv").config();
const express = require("express");
const server = express();
const port = 25566;

function isAuthorized(req, res, next) {
  const auth = req.headers.authorization;
  if (auth === "lollipop") {
    next();
  } else {
    res.status(401);
    res.send("Permission denied!");
  }
}

const products = [
  { id: 1, name: "hammer" },
  { id: 2, name: "nails" },
  { id: 3, name: "wrench" },
];
const users = [
  { id: 1, name: "John Petterson" },
  { id: 2, name: "Findus" },
];
//route index.html
server.get("/", isAuthorized, (req, res) => res.send("Hello World!"));
//route products
server.get("/products", isAuthorized, (req, res) => res.json(products));

server.get("/users", isAuthorized, (req, res) => {
  res.json(users);
});
//open and accept connections
server.listen(port, () =>
  console.log(`Server is running and listening on port ${port}!`)
);
