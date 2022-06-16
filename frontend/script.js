const textualView = document.getElementById("log");
const graphSelect = document.getElementById("graph-select");

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
    .map((graph) => `<option value ${graph.toLowerCase()}>${graph}</option>}`)
    .join("\n");

  graphSelect.innerHTML = options;
}

/**
 * Entrypoint of the website.
 * Fetches on launch the grah entities from the server to load them into the
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
