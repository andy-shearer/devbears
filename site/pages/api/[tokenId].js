export default function handler(req, res) {
  // get the tokenId from the query params
  const tokenId = req.query.tokenId;
  // As all the images are uploaded on github, we can extract the images from github directly.
  const image_url =
    "https://raw.githubusercontent.com/andy-shearer/nft-collection/master/my-app/public/cryptodevs/";

  // The api is sending back metadata for a Crypto Dev
  // To make our collection compatible with Opensea, we need to follow some Metadata standards
  // when sending back the response from the api
  // More info can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: "WorldCongress Dev Bear #" + tokenId,
    description: "The iconic symbol of the city of Berlin, these Bears are a unique ownable asset for enthusiasts ahead of the 'WeAreDevelopers World Congress' taking place in Berlin in July 2022.",
    image: image_url + tokenId + ".svg",
  });
}
