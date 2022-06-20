let fs = require("fs");
let filename = "__.csv";
let writeStream;

function generateInhabitants() {
  filename = "Inhabitant.csv";
  writeStream = fs.createWriteStream(filename);
  for (let i = 2; i < 301; i++) {
    writeStream.write(`${i},Inhabitant${i},Avenue,1.0,2,0,false,0,8,false\n`);
  }
}
function generateKnows() {
  filename = "Knows.csv";
  writeStream = fs.createWriteStream(filename);
  writeStream.write(
    `:START_ID(Inhabitant), :END_ID(Inhabitant), some_param:INT\n`
  );
  for (let i = 2; i < 301; i++) {
    for (let j = 2; j < 301; j++) {
      if (i !== j) {
        writeStream.write(`${i},${j},23456\n`);
      }
    }
  }
}
function pickup() {
  filename = "Pickup.csv";
  writeStream = fs.createWriteStream(filename);

  writeStream.write(`:START_ID(Truck), :END_ID(Inhabitant), pickup_date:INT\n`);
  for (let i = 302; i < 322; i++) {
    for (let j = 2; j < 301; j++) {
      writeStream.write(`${i},${j},${i + j}\n`);
    }
  }
}

pickup();
writeStream.on("finish", () => {
  console.log("wrote all data to file");
});

// close the stream
writeStream.end();
