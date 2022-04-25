import mergeImages from "merge-images";
const { Canvas, Image } = require('canvas');

let pathPrefix = "./bearbuild/";

function getBackgroundNum(input) {
  let count = 0;
  for(let i=0; i<5; i++) {
    count += parseInt(input[i]);
  }

  return (count % 2) + 1;
}

function getPath(identifier) {
  return pathPrefix + identifier;
}

export default async function buildImage(api, input = "11111") {
  console.debug("Input string for new bear:", input)
  const imgPrefix = "data:image/png;base64,";
  if(api) {
    pathPrefix = "./public/bearbuild/"
  }
  const bgNum = getBackgroundNum(input);

  const base64 = await mergeImages(
    [
      getPath(`background${bgNum}.png`),
      getPath("bearbody.png"),
      getPath("bearhead.png")
    ],
    {
      Canvas: Canvas,
      Image: Image
    }
  );

  // TODO: Save the image once generated so we don't have to rebuild it every time
  return base64;
}
