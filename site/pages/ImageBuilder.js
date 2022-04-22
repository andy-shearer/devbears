import mergeImages from "merge-images";
const { Canvas, Image } = require('canvas');

function getBackgroundNum(input) {
  let count = 0;
  for(let i=0; i<5; i++) {
    count += parseInt(input[i]);
  }

  return (count % 2) + 1;
}

export default async function buildImage(input) {
  console.log("Input string for new bear:", input)
  const imgPrefix = "data:image/png;base64,";

  const bgNum = getBackgroundNum(input);

  const base64 = await mergeImages(
    [`./bearbuild/background${bgNum}.png`, "./bearbuild/bearbody.png", "./bearbuild/bearhead.png" ],
    {
      Canvas: Canvas,
      Image: Image
    }
  );

  // TODO: Save the image once generated so we don't have to rebuild it every time
  return base64;
}
