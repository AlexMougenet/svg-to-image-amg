const svg = require('./svg');



module.exports.render = async (event) => {
  // TODO get image content
  const image = event.image;

  return await svg(image, { width: 2000 });

};