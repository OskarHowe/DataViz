import express from "express";
const server = express();
const port = process.env.PORT || 25566;
import { createClient } from "redis";

//route index.html
server.get("/", async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  if (!redis) {
    //the client is not yet initialized
    res
      .status(505)
      .send("No connection between Backend and Redis-Stack established");
  } else {
    res.send("Already connected to Redis-Stack");
  }
});
//route graphs: returns a list of strings which are the keys of the graph entities
server.get("/graphs", async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  if (!redis) {
    //server error
    res
      .status(505)
      .send(
        "No connection between Server and Redis-Stack has been established before"
      );
  } else {
    try {
      let graphs = await redis.graph.list();
      res.json(graphs);
    } catch (e) {
      console.log(e);
      res.status(506).send("An error occured when fetching the graph entities");
    }
  }
});

let redis;
redis = createClient({
  url: "redis://127.0.0.1:6379",
});
redis.on("error", (err) => console.log("Redis Client Error", err));
await redis.connect();
console.log("Connection to Redis-Stack established");
//redis.shutdown();
process.on("SIGINT", function (redis) {
  console.log("\nShutting down server");
  redis.shutdown;
  process.exit();
});
//open and accept connections
server.listen(port, () =>
  console.log(`Server is running and listening on  http://localhost:${port}`)
);
