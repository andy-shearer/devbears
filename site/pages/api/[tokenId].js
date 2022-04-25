import buildImage from "../../utils/ImageBuilder";

export default async function handler(req, res) {
  // get the query params
  const tokenId = req.query.tokenId;
  const inputString = req.query.iStr;

  const imgData = await buildImage(true, inputString);
  // More info on metadata standards can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: "WorldCongress Dev Bear #" + tokenId,
    description: "The iconic symbol of the city of Berlin, these Bears are a unique ownable asset for enthusiasts ahead of the 'WeAreDevelopers World Congress' taking place in Berlin in July 2022.",
    image: imgData
  });
}
