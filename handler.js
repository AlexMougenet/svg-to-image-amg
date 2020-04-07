const svg = require('./svg');



module.exports.render = async (event) => {
  const image = Buffer.from(event.body, 'base64').toString('utf8');

  const png = await svg(image, { width: 2000 });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png'
    },
    body: png,
    isBase64Encoded: true
  }

};