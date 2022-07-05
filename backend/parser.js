/**
 * The response from redis:
 * headers:
 * 
 * 1) 1) "n1"
      2) "r"
      3) "n2"


 * data:
 * 
 * 2) 1) 1) 1) 1) "id"
            2) "0"
         2) 1) "labels"
            2) 1) "actor"
         3) 1) "properties"
            2) 1) 1) "name"
                  2) "Aldis Hodge"
               2) 1) "birth_year"
                  2) "1986"
      2) 1) 1) "id"
            2) "1"
         2) 1) "type"
            2) "act"
         3) 1) "src_node"
            2) "0"
         4) 1) "dest_node"
            2) "4"
         5) 1) "properties"
            2) (empty list or set)
      3) 1) 1) "id"
            2) "4"
         2) 1) "labels"
            2) 1) "movie"
         3) 1) "properties"
            2) 1) 1) "title"
                  2) "Straight Outta Compton"
               2) 1) "genre"
                  2) "Biography"
               3) 1) "votes"
                  2) "127258"
               4) 1) "rating"
                  2) "7.9"
               5) 1) "year"
                  2) "2015"
   2) 1) 1) 1) "id"
            2) "0"
         2) 1) "labels"
            2) 1) "actor"
         3) 1) "properties"
            2) 1) 1) "name"
                  2) "Aldis Hodge"
               2) 1) "birth_year"
                  2) "1986"
      2) 1) 1) "id"
            2) "0"
         2) 1) "type"
            2) "act"
         3) 1) "src_node"
            2) "0"
         4) 1) "dest_node"
            2) "5"
         5) 1) "properties"
            2) (empty list or set)
      3) 1) 1) "id"
            2) "5"
         2) 1) "labels"
            2) 1) "movie"
         3) 1) "properties"
            2) 1) 1) "title"
                  2) "Never Go Back"
               2) 1) "genre"
                  2) "Action"
               3) 1) "votes"
                  2) "15821"
               4) 1) "rating"
                  2) "6.4"
               5) 1) "year"
                  2) "2016"

 *metadata:

 3) 1) "Cached execution: 1"
   2) "Query internal execution time: 0.165887 milliseconds"
 *
 */

class Vertex {
  id; // Integer
  labels; // String[]
  properties; // {key:String -> String}
  toVertices; //integer [] nodeIDs
  fromVertices; //integer [] nodeIDs
  constructor(id, labels, properties) {
    this.id = id;
    this.labels = labels;
    this.properties = properties;
    this.toVertices = [];
    this.fromVertices = [];
  }
}
class Edge {
  id; // Integer
  type; // String[]
  sourceNode; // Integer
  destinationNode; // Integer
  properties; // {key:String -> String}
  constructor(id, type, sourceNode, destinationNode, properties) {
    this.id = id;
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;
    this.type = type;
    this.properties = properties;
  }
}
/**
 * Combines the request results Grqph.Query into one object which can be parsed with this parser
 * @param {*} responseEdges
 * @param {*} responseNode
 */
export function combineNodeEdgesResponse(responseEdges, responseNode) {
  let combinedGeaph = responseNode;
  //add edges into the node array
  responseEdges.data.map(function (element) {
    responseNode.data.push(element);
  });
  return responseNode;
}
//helper function because Map cant be serialized
//https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function mapToArrayofObjects(map) {
  let vertices = [];
  map.forEach(function (value, key) {
    vertices.push(value);
  });
  console.log(map.size);
  console.log(vertices);
  return vertices;
}
function parsePropertiesToObject(properties) {
  let property = {}; // [Property]

  properties[1].map((element) => {
    property[element[0]] = element[1];
    //console.log(`${element[0]}: ${element[1]}`);
  });
  return property;
}
/**
 * Can I guaranty that the IDs of the edges and nodes are unique or do I have to remap them?
 * No I cant, IDs for vertices and edges can be equal
 * @param {*} response
 * @returns
 */
export function parseGraphToObject(response) {
  const headers = response.headers;
  const graph = response.data;
  const metadata = response.metadata;

  let edges = []; //[Edge]
  let edgesIndices = []; //[Integer]
  let verticesMap = new Map();
  graph.map(function (currResp) {
    //currResp = [(n1)-[r]->[n2]]
    currResp.map(function (currVertexEdge, index) {
      //currVertexEdge = (n1)-[r]->[n2]

      //is it a Vertex or an Edge?
      let id = currVertexEdge[0][1];
      if (currVertexEdge[1][0] === "labels") {
        //Vertex
        if (!verticesMap.has(id)) {
          //create new vertex
          let props = parsePropertiesToObject(currVertexEdge[2]);

          const vertex = new Vertex(id, currVertexEdge[1][1][0], props);
          verticesMap.set(id, vertex);
        }
      } else if (currVertexEdge[1][0] === "type") {
        //Edge
        //edge already exist? ->
        if (!edgesIndices.includes(id)) {
          let props = parsePropertiesToObject(currVertexEdge[4]);
          let sourceNode = verticesMap.get(currVertexEdge[2][1]);
          let destinationNode = verticesMap.get(currVertexEdge[3][1]);
          const edge = new Edge(
            id,
            currVertexEdge[1][1],
            currVertexEdge[2][1], //source node id
            currVertexEdge[3][1], //destination node id
            props
          );
          //update adjecency list of sourcenode
          if (sourceNode) {
            //need to check because one node must not exist in the response but can be referenced as endpoint of an edge
            sourceNode.toVertices.push(currVertexEdge[3][1]); //add destination node id
            verticesMap.delete(sourceNode.id);
            verticesMap.set(sourceNode.id, sourceNode);
          }
          //update adjecency list of destinationnode
          if (destinationNode) {
            destinationNode.fromVertices.push(currVertexEdge[2][1]); //add source node id
            verticesMap.delete(destinationNode.id);
            verticesMap.set(destinationNode.id, destinationNode);
          }
          edges.push(edge);
          edgesIndices.push(id);
        }
      } else {
        // Fail
      }
    });
  });
  let vertices = mapToArrayofObjects(verticesMap);
  return {
    vertices,
    edges,
  };
}

export function getQueryExecutionTime(response) {
  let metadata = response.metadata;
  const graphFetchTime = parseFloat(metadata[1].match(/[+-]?\d+\.*\d+/g));
  //const graphFetchUnit = metadata[1].match(/milliseconds/);
  return graphFetchTime;
}
