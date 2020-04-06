const fs = require('fs')
const { promisify } = require('util')
const svgexport = require('./svgexport');

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

module.exports.render = async (event) => {
  console.log('render');
  const now = new Date().getTime();
  console.log(event);
  
  await writeFile(`${now}.svg`, event);
  
  await svgexport.render({
    input: `${__dirname}/${now}.svg`,
    output: `${__dirname}/${now}.png 2480`,
  });
  // read converted image
  const png = readFile(`${now}.png`);

  // cleanup files
  unlink(`${now}.svg`);
  unlink(`${now}.png`);

  // send image back
  const response = {
    statusCode: 200,
    body: png,
  };
  return response;
};