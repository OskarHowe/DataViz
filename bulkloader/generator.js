let fs = require("fs");
let filename = "__.csv";
let writeStream;

let inhabitants = 10000;
let trucks = 30;

function generateInhabitants() {
  filename = "Inhabitant.csv";
  writeStream = fs.createWriteStream(filename);
  writeStream.write(`:ID(Inhabitant),name:STRING,parentName:STRING,agression:FLOAT,trashproduction:INT,bin:INT,manifestation:BOOL,trashStack:INT,mentality:INT,surroundingManif:BOOL
  \n`);
  for (let i = 0; i < inhabitants; i++) {
    writeStream.write(`${i},Inhabitant${i},Avenue,1.0,2,0,false,0,8,false\n`);
  }
  writeStream.on("finish", () => {
    console.log("wrote all data to file");
  });

  // close the stream
  writeStream.end();
}
function generateTrucks() {
  filename = "Truck.csv";
  writeStream = fs.createWriteStream(filename);
  writeStream.write(
    `:ID(Truck), name:STRING,parentName:STRING,volume:INT,fullness:INT,CostPerRoute:FLOAT,active:BOOL,baseCost:FLOAT,malfunctionPerYear:INT,lastFullness:INT`
  );
  for (let i = inhabitants; i < inhabitants + trucks + 1; i++) {
    writeStream.write(
      `${i},Truck${i - inhabitants + 1},Avenue,3500,0,0.0,false,300.0,7,0\n`
    );
  }
  writeStream.on("finish", () => {
    console.log("wrote all data to file");
  });

  // close the stream
  writeStream.end();
}
function generateKnows() {
  filename = "Knows.csv";
  writeStream = fs.createWriteStream(filename);
  writeStream.write(
    `:START_ID(Inhabitant), :END_ID(Inhabitant), some_param:INT\n`
  );
  for (let i = 0; i < inhabitants; i++) {
    for (let j = 0; j < inhabitants; j++) {
      if (i !== j) {
        writeStream.write(`${i},${j},23456\n`);
      }
    }
  }
  writeStream.on("finish", () => {
    console.log("wrote all data to file");
  });

  // close the stream
  writeStream.end();
}
function pickup() {
  filename = "Pickup.csv";
  writeStream = fs.createWriteStream(filename);

  writeStream.write(`:START_ID(Truck), :END_ID(Inhabitant), pickup_date:INT\n`);
  for (let i = inhabitants; i < inhabitants + trucks; i++) {
    for (let j = 0; j < inhabitants; j++) {
      writeStream.write(`${i},${j},${i + j}\n`);
    }
  }
  writeStream.on("finish", () => {
    console.log("wrote all data to file");
  });

  // close the stream
  writeStream.end();
}

generateInhabitants();
generateTrucks();
generateKnows();
pickup();
