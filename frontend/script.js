const textualView = document.getElementById("log");
const graphSelect = document.getElementById("graph-select");
const downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", fetchGraphEntity);
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
      console.log(`Start: ${startTime}, End: ${endTime}`);
      console.log(json);
      logString(`Fetched ${graphId} from server`);
      logDurationGraphically(json.measures);
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
