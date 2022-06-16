const textualView = document.getElementById("log");
const graphSelect = document.getElementById("graph-select");

function logString(string) {
  let newP = document.createElement("p");
  var text = document.createTextNode(string);
  newP.appendChild(text);
  textualView.appendChild(newP);
}
function populateGraphSelect(json) {
  console.log(json);
  let graphs = JSON.parse(JSON.stringify(json));
  //let graphs = ["1", "2", "3"];
  let options = graphs
    .map((graph) => `<option value ${graph.toLowerCase()}>${graph}</option>}`)
    .join("\n");

  graphSelect.innerHTML = options;
}

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
