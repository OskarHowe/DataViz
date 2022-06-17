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
  var text = document.createTextNode(string);
  newP.appendChild(text);
  textualView.appendChild(newP);
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
