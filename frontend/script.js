const textfield = document.getElementById("respose");
textfield.innerHTML = "hello World";
fetch("http://localhost:25566/") //because fetch returns a promise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.text();
  })
  .then((text) => {
    textfield.innerHTML = text;
  })
  .catch((error) => {
    alert("Error in response: " + error);
  });
