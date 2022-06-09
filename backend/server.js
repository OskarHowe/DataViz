const express = require("express");
const server = express();
const port = 25566;

const products = [
  { id: 1, name: "hammer" },
  { id: 2, name: "nails" },
  { id: 3, name: "wrench" },
];
server.get("/", (req, res) => res.send("Hello World!"));

server.listen(port, () =>
  console.log(`Server is running and listening on port ${port}!`)
);
