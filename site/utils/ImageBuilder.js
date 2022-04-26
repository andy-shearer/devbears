import mergeImages from "merge-images";
const { Canvas, Image } = require('canvas');

let pathPrefix = "./bearbuild/";

function getBackgroundNum(input) {
  let count = 0;
  for(let i=0; i<5; i++) {
    count += parseInt(input[i]);
  }

  return (count % 7) + 1;
}

function getPath(identifier) {
  return pathPrefix + identifier;
}

function getArea(input) {
  let areaId = input[0];
  if(areaId == 0 || areaId > 5) {
    areaId = 1;
  }

  return getPath(`area${areaId}.png`);
}

function getFlag(input) {
  let flagId = input[1];
  if(flagId == 0 || flagId > 9) {
    flagId = 9;
  }

  return getPath(`flag${flagId}.png`);
}

function getOS(input) {
  let osId = input[3];
  if(osId == 0 || osId > 4) {
    osId = 4;
  }

  return getPath(`os${osId}.png`);
}

function getLang(input) {
  let langId = input[2];
  if(langId == 0 || langId > 9) {
    langId = 9;
  }

  return getPath(`lang${langId}.png`);
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
      getPath("bearhead.png"),
      getFlag(input),
      getPath("bearlefthand.png"),
      getPath("bearrighthand.png"),
      getArea(input),
      getOS(input),
      getLang(input)
    ],
    {
      Canvas: Canvas,
      Image: Image
    }
  );

  // TODO: Save the image once generated so we don't have to rebuild it every time
  return base64;
}
