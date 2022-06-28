import React, { useState, useEffect } from "react";
import logo from "./cosmotechDark.png";
import "./App.css";

function App() {
  const [graphRedisStrings, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:25566/graphs") //because fetch returns a promise
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log(`List of graph entities in Redis fetched: ${json}`);
        setPosts(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-description">
          <h1>Dataviz</h1>
          <h2>Digitial Twin Management Solution</h2>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        {graphRedisStrings.map((string) => {
          return <p>{string}</p>;
        })}
      </main>
    </div>
  );
}

export default App;
