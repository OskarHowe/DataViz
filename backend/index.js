import express from "express";
const server = express();
const port = process.env.PORT || 25566;
import { createClient } from "redis";

let redis;

//route index.html
server.get("/", async function (req, res) {
  if (!redis) {
    //the client is not yet initialized
    redis = createClient({
      url: "redis://127.0.0.1:6379",
    });
    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();
    res.header("Access-Control-Allow-Origin", "*");
    res.send("Conected to Redis-Stack");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("Already connected to Redis-Stack");
  }
});
//route graphs: returns a list of strings which are the keys of the graph entities
server.get("/graphs", async function (req, res) {
  if (!redis) {
    res.send("Can't get graphs if not connected to Redis-Stack");
  } else {
    try {
      let graphs = await redis.graph.list();
      res.json(graphs);
    } catch (e) {
      console.log(e);
      res.send("An error occured");
    }
  }
});

//open and accept connections
server.listen(port, () =>
  console.log(`Server is running and listening on port ${port}!`)
);
