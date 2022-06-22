const textualView = document.getElementById("log");
const graphSelect = document.getElementById("graph-select");
const downloadBtn = document.getElementById("download-btn");
const graphNode = document.getElementById("graph-node");
const graphicsType = [
  "circle",
  "rect",
  "ellipse",
  "triangle",
  "diamond",
  "star",
];
const graphicsColors = [
  "#5F95FF", // blue
  "#61DDAA",
  "#65789B",
  "#F6BD16",
  "#7262FD",
  "#78D3F8",
  "#9661BC",
  "#F6903D",
  "#008685",
  "#F08BB4",
];

downloadBtn.addEventListener("click", fetchGraphEntity);

function getAttributeCombinationOnTheFly(
  attributeArray,
  elementClass,
  usedAttributesMap
) {
  if (!usedAttributesMap.has(elementClass)) {
    const usedAttributesArray = Array.from(usedAttributesMap.values());
    let freeAttributes = attributeArray.filter(
      (val) => !usedAttributesArray.includes(val)
    );
    if (freeAttributes.length > 0) {
      usedAttributesMap.set(elementClass, freeAttributes[0]);
    } else {
      usedAttributesMap.set(elementClass, attributeArray[0]); //bad default case...
      console.log(
        `The amount of elemet classes is bigger then the possible attributes so attributes will be used multiple times`
      );
    }
  }
  return usedAttributesMap.get(elementClass);
}
function convertGraphJSONtoG6Format(grapJsonObj) {
  let g6Graph = {
    nodes: [],
    edges: [],
  };
  let usedAttributesMap = new Map();
  grapJsonObj.vertices.forEach((node) => {
    let color = getAttributeCombinationOnTheFly(
      graphicsColors,
      node.labels,
      usedAttributesMap
    );
    const g6Vertex = {
      id: "node" + node.id,
      //label: node.labels,
      class: node.labels,
      style: {
        fill: color,
        opacity: 0.2,
        stroke: color,
        strokeOpacity: 0.85,
      },
    };
    g6Graph.nodes.push(g6Vertex);
  });
  grapJsonObj.edges.forEach((edge) => {
    const g6Edge = {
      //label: edge.type, // String[]
      source: "node" + edge.sourceNode, // Integer
      target: "node" + edge.destinationNode, // Integer
      labelCfg: {
        autoRotate: true, // Whether to rotate the label according to the edges
      },
    };
    g6Graph.edges.push(g6Edge);
  });
  console.log(g6Graph.nodes);
  return g6Graph;
}

function displayGraph(grapJsonObj, cavasWidth, canvasHeight, container) {
  let children = graphNode.childNodes;
  children.forEach((child) => {
    graphNode.removeChild(child);
  });
  const data = convertGraphJSONtoG6Format(grapJsonObj);
  const graph = new G6.Graph({
    container: container, // String | HTMLElement, required, the id of DOM element or an HTML node
    width: cavasWidth, // Number, required, the width of the graph
    height: canvasHeight, // Number, required, the height of the graph
    modes: {
      default: ["drag-canvas", "zoom-canvas", "drag-node"], // Allow users to drag canvas, zoom canvas, and drag nodes
    },
    layout: {
      type: "gForce",
      center: [200, 200], // The center of the graph by default
      linkDistance: 1,
      nodeStrength: 1000,
      edgeStrength: 200,
      nodeSize: 30,
      onTick: () => {
        console.log("ticking");
      },
      onLayoutEnd: () => {
        console.log("force layout done");
      },
      workerEnabled: true, // Whether to activate web-worker
      gpuEnabled: true, // Whether to enable the GPU parallel computing, supported by G6 4.0
      // more options are shown below
    },
  });
  console.log(`canvasWidth: ${cavasWidth}, canvasHeight: ${canvasHeight}`);
  graph.data(data); // Load the data defined in Step 2
  graph.render(); // Render the graph
}

/**
 * Appends a given string to the textualView node
 * @param {String} string
 */
function logString(string) {
  let newP = document.createElement("p");
  let text = document.createTextNode(string);
  newP.appendChild(text);
  textualView.appendChild(newP);
}
/**
 * Logs the measure object with format 
 * measures: [
      0: Object { graphFetchDuration: 22.398049 }
      1: Object { redisFetchDuration: 66.65680100023746 }
      2: Object { graphParseDuration: 2.264869999140501 }
      3: Object { nodeFetchDuration: 87 }
  ]
  specifically for userfriendly appearance

  Duration Measures:
  NodeFetch
  |  GraphParse
  |  |  RedisFetch
  |  |  |  GraphFetch
  |  |  |  22.3980
  |  |  66.65680 
  |  2.26486
  87        
 * @param {*} measure 
 */
function logDurationGraphically(measure) {
  const hr1 = document.createElement("hr");
  const hr2 = document.createElement("hr");

  textualView.appendChild(hr1);
  logString("Duration Measures:");
  textualView.appendChild(generateNodeTree(measure.reverse(), 0));
  textualView.appendChild(hr2);
}
/**
 * <!-- <p>Duration Measures:</p>
        <ul>
          <li>NodeFetch</li>
          <li>
            <ul>
              <li>GraphParse</li>
              <li>
                <ul>
                  <li>RedisFetch</li>
                  <li>
                    <ul>
                      <li>GraphFetch</li>
                      <li>22.40 ms</li>
                    </ul>
                  </li>
                  <li>66.66 ms</li>
                </ul>
              </li>
              <li>2.26 ms</li>
            </ul>
          </li>
          <li>87 ms</li>
        </ul> -->
 * take the first element in the measureArray and create a
 * <ul></ul> from it with 3 <li>, insert into the 2nd <li> the rteurn of this function
 * called onto the arry without the first element. if size == 1 rekusion break
 * @param {*} measureArray
 */
function generateNodeTree(measureArray, index) {
  const newUL = document.createElement("ul");
  const li1 = document.createElement("li");
  const li3 = document.createElement("li");

  let currentKey = Object.keys(measureArray[index]).at(0); //object with only one key
  const text1 = document.createTextNode(currentKey);
  const text3 = document.createTextNode(`
    ${parseInt(Object.values(measureArray[index]).at(0))} ms
    `);
  li1.appendChild(text1);
  li3.appendChild(text3);
  newUL.appendChild(li1);
  if (index !== measureArray.length - 1) {
    //the current element is not the last element
    //so call recursion
    const li2 = document.createElement("li");
    li2.appendChild(generateNodeTree(measureArray, index + 1));
    newUL.appendChild(li2);
  }
  newUL.appendChild(li3);
  return newUL;
}
/**
 * Populates the <select> node, id: graph-select
 * with the elements in the given json array with the format
 * ["string1","string2","string3","string4"]
 *
 * @param {} json
 */
function populateGraphSelect(json) {
  console.log(json);
  let graphs = JSON.parse(JSON.stringify(json));
  let options = graphs
    .map((graph) => `<option value="${graph}">${graph}</option>}`)
    .join("\n");

  graphSelect.innerHTML = options;
}
/**
 * called when download-btn is clicked
 * gets as input the selected option in the dropdown menu
 * !!error handling when no option is loaded, security problems but api is open anyways!!
 * fetches a graph entity from the server
 * logs the event
 *
 * --> should be grayed out depending on the selected option in dropdown menu to prevent heavy downlaoding
 * --> or cash graph and "simpulate" download
 */
function fetchGraphEntity() {
  const graphId = graphSelect.value;
  //logString(`Selected ${graphId} to download`);
  const startTime = window.performance.now();
  fetch(`http://localhost:25566/graph/${graphId}`) //because fetch returns a promise
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      const endTime = window.performance.now();
      json.measures.push({ nodeFetchDuration: endTime - startTime });
      logString(`Fetched ${graphId} from server`);
      const startTimeDisplayGraph = window.performance.now();
      displayGraph(
        json.graph,
        graphNode.clientWidth,
        graphNode.clientHeight,
        "graph-node"
      );
      const endTimeDisplayGraph = window.performance.now();
      json.measures.push({
        graphDisplayDuration: endTimeDisplayGraph - startTimeDisplayGraph,
      });
      logDurationGraphically(json.measures);
      console.log(json);
    })
    .catch((error) => {
      logString(error);
    });
}
/**
 * Entrypoint of the website.
 * Fetches on launch the graph entities from the server to load them into the
 * select node
 */
fetch("http://localhost:25566/graphs") //because fetch returns a promise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => {
    populateGraphSelect(json);
    logString("List of graph entities in Redis fetched");
  })
  .catch((error) => {
    logString(error);
  });
