import express from "express";
const server = express();
const port = process.env.PORT || 25566;
import { createClient } from "redis";

let redis;
//TODO: create client with custum hos, port defined in .env
async function connect(host, port) {
  redis = createClient({
    url: "redis://127.0.0.1:6379",
  });
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();
  let graphs = await redis.graph.list();
  console.log(graphs);
}
async function getGraphs() {
  if (!redis) {
    return;
  } else {
    try {
      let graphs = await redis;
      console.log(graphs);
      return graphs;
    } catch (e) {
      console.log("Failed to execute Graph.list" + e);
    }
  }
}
//route index.html
server.get("/", async function (req, res) {
  if (!redis) {
    redis = await connect();
    res.send("Conected to Redis-Stack");
  } else {
    res.send("Already connected to Redis-Stack");
  }
});
//route products
server.get("/graphs", async function (req, res) {
  if (!redis) {
    res.send("Can't get graphs if not connected to Redis-Stack");
  } else {
    try {
      let graphs = getGraphs();
      console.log(graphs);
      res.json("graphs");
    } catch (e) {
      console.log(e);
      res.send("An error occured");
    }
  }
});
server.get("/hello", async function (req, res) {
  if (!redis) {
    res.send("Can't get graphs if not connected to Redis-Stack");
  } else {
    try {
      await redis.set("hello", "world");
      res.json("graphs");
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
