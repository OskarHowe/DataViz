import express from "express";
import cors from "cors";
const server = express();
const port = process.env.PORT || 25566;
import { createClient } from "redis";
import {
  getQueryExecutionTime,
  parseGraphToObject,
  combineNodeEdgesResponse,
} from "./parser.js";
import { performance } from "perf_hooks";
server.use(cors());
//route index.html
server.get("/", async function (req, res) {
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
server.get("/graph/:id", async function (req, res) {
  if (!redis) {
    //server error
    res
      .status(505)
      .send(
        "No connection between Server and Redis-Stack has been established before"
      );
  } else {
    try {
      let graphid = req.params.id;
      //GRAPH.QUERY id 'Match (n1)-[r]->(n2) return n1,r,n2'
      const startTime = performance.now();
      const respNodes = await redis.graph.QUERY_RO(
        graphid,
        "Match (a) return a"
      );
      const respEdges = await redis.graph.QUERY_RO(
        graphid,
        "Match (n1)-[r]->(n2) return r"
      );
      const endTime = performance.now();
      const startTimeParseGraph = performance.now();
      const respGraph = combineNodeEdgesResponse(respEdges, respNodes);
      let graphObject = parseGraphToObject(respGraph); //could be improved by making it async
      let nodesFetchExecutionTime = getQueryExecutionTime(respNodes);
      let edgesFetchExecutionTime = getQueryExecutionTime(respEdges);

      let graphExecutionTime =
        nodesFetchExecutionTime + edgesFetchExecutionTime; //could be improved by making it async
      const endTimeParseGraph = performance.now();
      //end timer and put into nodeFetchMeasure
      //console.log(`Start: ${startTime}, End: ${endTime}`);
      const combinedObj = {
        graph: graphObject,
        measures: [
          { nodesFetchDuration: nodesFetchExecutionTime },
          { edgesFetchDuration: edgesFetchExecutionTime },
          { graphFetchDuration: graphExecutionTime },
          { redisFetchDuration: endTime - startTime },
          { graphParseDuration: endTimeParseGraph - startTimeParseGraph },
        ],
      };
      res.json(combinedObj);
    } catch (e) {
      console.log(e);
      res
        .status(507)
        .send(`An error occured when fetching graph entity ${graphid}`);
    }
  }
});
/**
 *
 *
 * return: the node with the corresponding id and the number and ids of incoming and leaving edges
 */
server.get("/:graph/node/:id", async function (req, res) {
  if (!redis) {
    //server error
    res
      .status(505)
      .send(
        "No connection between Server and Redis-Stack has been established before"
      );
  } else {
    try {
      let graphid = req.params.graph;
      //GRAPH.QUERY id 'Match (n1)-[r]->(n2) return n1,r,n2'
      const startTime = performance.now();
      const respNodes = await redis.graph.QUERY_RO(
        graphid,
        `Match (node) where id(node) = ${req.params.id} return distinct node`
      );
      const respEdges = await redis.graph.QUERY_RO(
        graphid,
        `Match (node)-[r]-(n2) where id(node) = ${req.params.id} return distinct r`
      );
      const endTime = performance.now();
      const startTimeParseGraph = performance.now();
      //bad request eg: node is out of bounds:
      if (respNodes.data.length === 0) {
        //console.log("in throw case");
        throw {
          name: "NodeFetchError",
          message: "did not find a node corresponding to the id",
        };
      }
      // console.log(respNodes);
      // respNodes.data.map((elem) => {
      //   console.log(elem);
      // });
      // respEdges.data.map((elem) => {
      //   console.log(elem);
      // });
      const respGraph = combineNodeEdgesResponse(respEdges, respNodes);
      let graphObject = parseGraphToObject(respGraph); //could be improved by making it async
      let nodesFetchExecutionTime = getQueryExecutionTime(respNodes);
      let edgesFetchExecutionTime = getQueryExecutionTime(respEdges);
      let graphExecutionTime =
        nodesFetchExecutionTime + edgesFetchExecutionTime; //could be improved by making it async
      const endTimeParseGraph = performance.now();
      //end timer and put into nodeFetchMeasure
      //console.log(`Start: ${startTime}, End: ${endTime}`);
      const combinedObj = {
        graph: graphObject,
        measures: [
          { nodesFetchDuration: nodesFetchExecutionTime },
          { edgesFetchDuration: edgesFetchExecutionTime },
          { graphFetchDuration: graphExecutionTime },
          { redisFetchDuration: endTime - startTime },
          { graphParseDuration: endTimeParseGraph - startTimeParseGraph },
        ],
      };
      res.json(combinedObj);
    } catch (e) {
      console.log(e);
      res
        .status(507)
        .send(
          `An error occured when fetching graph entity ${req.params.graph}: ${e.message}`
        );
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
