const RedisGraph = require("redisgraph.js").Graph;
//https://developer.redis.com/howtos/redisgraph/using-javascript/

async function getGraph() {
  const graph = new RedisGraph("IMDB", "localhost", "6379");
  //let res = await graph.query("MATCH (a) RETURN a");
  let res = await graph.query(
    'Match(a:actor)-[:act]->(m:movie{title:"Straight Outta Compton"}) return a.name'
  );
  while (res.hasNext()) {
    let record = res.next();
    console.log(record.get("a.name"));
  }
  console.log(res._results);
  graph.close();
}
getGraph();
