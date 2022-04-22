import buildImage from "../../utils/ImageBuilder";

export default async function handler(req, res) {
  // get the query params
  const tokenId = req.query.tokenId;
  const inputString = req.query.iStr;

  // As all the images are uploaded on github, we can extract the images from github directly.
  //const temp_svg = `<svg width="224" height="224" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"/><path d="M17.5 2a4.5 4.5 0 0 1 2.951 7.897A8.99 8.99 0 0 1 21 13 9 9 0 1 1 3.55 9.897a4.5 4.5 0 1 1 6.791-5.744 9.05 9.05 0 0 1 3.32 0A4.494 4.494 0 0 1 17.5 2zM10 13H8a4 4 0 0 0 7.995.2L16 13h-2a2 2 0 0 1-3.995.15L10 13z"/></svg>`;
  //const imgData = "data:image/svg+xml;base64," + Buffer.from(temp_svg, "binary").toString("base64");

  const imgData = await buildImage(inputString);
  // More info on metadata standards can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: "WorldCongress Dev Bear #" + tokenId,
    description: "The iconic symbol of the city of Berlin, these Bears are a unique ownable asset for enthusiasts ahead of the 'WeAreDevelopers World Congress' taking place in Berlin in July 2022.",
    image: imgData
  });
}
