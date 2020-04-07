const svg = require('./svg');



module.exports.render = async (event) => {
  const image = event.body;
  console.log("image");
  console.log(image);
  const png = await svg(image, { width: 2000 });
  console.log("png");
  console.log(png);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png'
    },
    body: png,
    isBase64Encoded: true
  }

};