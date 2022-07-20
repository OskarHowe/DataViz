const graphicsColors = [
  "#5F95FF", // blue
  "#61DDAA", //green
  "#ffb039", //cosmogold
  "#F08BB4", //pink
  "#F6BD16", //orange
  "#7262FD", //blue
  "#78D3F8", //azure
  "#9661BC", //purple
  "#F6903D", //orange
];

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

export { graphicsColors, getAttributeCombinationOnTheFly };
