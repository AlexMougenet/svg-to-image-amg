
const chromium = require('chrome-aws-lambda');

module.exports = async (content, opt) => {


  var browser = browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    dumpio: true,
    ignoreHTTPSErrors: true,
  });

  var page = await browser.newPage();

  if (process.env.SVGEXPORT_TIMEOUT) {
    await page.setDefaultNavigationTimeout(Number(process.env.SVGEXPORT_TIMEOUT) * 1000);
  }
  await page.setContent(content);
  var input = await page.evaluate(() => {

    var el = document.documentElement;
    var widthAttr = el.getAttribute('width');
    var heightAttr = el.getAttribute('height');
    var viewBoxAttr = el.getAttribute('viewBox');

    if (widthAttr && heightAttr && !/\%\s*$/.test(widthAttr)
      && !/\%\s*$/.test(heightAttr)) {
      return {
        size: true,
        left: 0,
        top: 0,
        width: el.width.animVal.value,
        height: el.height.animVal.value
      };
    } else if (viewBoxAttr && el.viewBox) {
      return {
        viewbox: true,
        left: el.viewBox.animVal.x,
        top: el.viewBox.animVal.y,
        width: el.viewBox.animVal.width,
        height: el.viewBox.animVal.height
      };
    } else {
      var box = el.getBoundingClientRect();
      return {
        bbox: true,
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height
      };
    }
  });

  await page.evaluate((input, opt) => {
    const scale = opt.width / input.width;
    var svg = document.getElementsByTagName('svg')[0];
    if (!input.viewbox && !svg.getAttribute('viewBox')) {
      svg.setAttribute('viewBox', '0 0 ' + input.width + ' ' + input.height);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    svg.setAttribute('id', 'svg');

    svg.removeAttribute('width');
    svg.removeAttribute('height');

    svg.style.setProperty('margin', 0, 'important');
    svg.style.setProperty('border', 0, 'important');
    svg.style.setProperty('padding', 0, 'important');

    svg.style.setProperty('position', 'fixed', 'important');


    svg.style.setProperty('width', (input.width * scale) + 'px', 'important');
    svg.style.setProperty('height', (input.height * scale) + 'px', 'important');

  }, input, opt);

  const svgEl = await page.$('#svg')
  const b64string = await svgEl.screenshot({ encoding: "base64" });
  await browser.close();
  return b64string;

}


