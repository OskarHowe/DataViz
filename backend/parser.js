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
  constructor(id, labels, properties) {
    this.id = id;
    this.labels = labels;
    this.properties = properties;
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

function parsePropertiesToObject(properties) {
  let property = {}; // [Property]

  properties[1].map((element) => {
    property[element[0]] = element[1];
    //console.log(`${element[0]}: ${element[1]}`);
  });
  //console.log(property);
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
  let vertices = [];
  let vertexIndices = []; //[Integer]

  graph.map(function (currResp) {
    //currResp = [(n1)-[r]->[n2]]
    currResp.map(function (currVertexEdge, index) {
      //currVertexEdge = (n1)-[r]->[n2]

      //is it a Vertex or an Edge?
      let id = currVertexEdge[0][1];
      if (currVertexEdge[1][0] === "labels") {
        //Vertex
        if (!vertexIndices.includes(id)) {
          //create new vertex
          let props = parsePropertiesToObject(currVertexEdge[2]);

          const vertex = new Vertex(id, currVertexEdge[1][1][0], props);
          vertices.push(vertex);
          vertexIndices.push(id);
        }
      } else if (currVertexEdge[1][0] === "type") {
        //Edge
        //edge already exist? ->
        if (!edgesIndices.includes(id)) {
          let props = parsePropertiesToObject(currVertexEdge[4]);
          const edge = new Edge(
            id,
            currVertexEdge[1][1],
            currVertexEdge[2][1],
            currVertexEdge[3][1],
            props
          );
          edges.push(edge);
          edgesIndices.push(id);
        }
      } else {
        // Fail
      }
    });
  });
  return {
    edgesIndices,
    vertexIndices,
    edges,
    vertices,
  };
}

export function getQueryExecutionTime(response) {
  let metadata = response.metadata;
  const graphFetchTime = parseFloat(metadata[1].match(/[+-]?\d+\.*\d+/g));
  //const graphFetchUnit = metadata[1].match(/milliseconds/);
  return graphFetchTime;
}
