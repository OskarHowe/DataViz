import { createClient } from "redis";

let client;
//TODO: create client with custum hos, port defined in .env
async function connect(host, port) {
  client = createClient();
  await client.connect();
}

//TOTO: write a query which returns a list of all graph instances
async function getAllGraphEntities() {
  let graphs = await client.graph.list(); //arry of keys
  return graphs;
}

async function quit() {
  await client.quit();
}

export { connect, getAllGraphEntities, quit };
