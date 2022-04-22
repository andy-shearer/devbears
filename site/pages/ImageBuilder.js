import mergeImages from "merge-images";
const { Canvas, Image } = require('canvas');

export default async function buildImage(input) {
  console.log("Input string for new bear:", input)
  const imgPrefix = "data:image/png;base64,";
  const base64 = await mergeImages(
    ["./bearbuild/background.png", "./bearbuild/bearbody.png", "./bearbuild/bearhead.png" ],
    {
      Canvas: Canvas,
      Image: Image
    }
  );

  // TODO: Save the image once generated so we don't have to rebuild it every time
  return base64;
}
