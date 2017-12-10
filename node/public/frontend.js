var host = location.origin.replace(/^http/,'ws');
var ws = new WebSocket(host);

var can = document.querySelector('canvas'),
  ctx = can.getContext('2d'),
  colIndex = 0,
  imgTimeout,
  loopRate = 200;

function drawToCanvas (files) {
  if (imgTimeout) {
    stopLoop();
  }
  var fr = new FileReader();
  fr.onload = function (loadevt) {
    var img = new Image();
    img.onload = function () {
      can.width = 16 * (img.width / img.height);
      can.height = 16;
      ctx.fillStyle = 'black';
      ctx.fillRect(0,0,can.width,can.height);
      ctx.drawImage(img, 0,0,can.width,can.height);
      loopOverImage();
    };
    img.src = loadevt.target.result;
  };
  fr.readAsDataURL(files[0]);
}

function flipHoriz () {
  ctx.save();
  ctx.translate(can.width,0);
  ctx.scale(-1,1);
  ctx.drawImage(can,0,0);
  ctx.restore();
}

function flipVert () {
  ctx.save();
  ctx.translate(0,can.height);
  ctx.scale(1,-1);
  ctx.drawImage(can,0,0);
  ctx.restore();
}

function loopOverImage () {
  postColumn(colIndex);
  colIndex++;
  if (colIndex >= can.width) {
    colIndex = colIndex % can.width;
  }
  imgTimeout = setTimeout(loopOverImage, loopRate);
}

function postColumn (col) {
  let imgData = ctx.getImageData(col,0,1,can.height);
  let colStr = '#';
  for (var i=0; i < imgData.data.length; i+=4) {
    var r = gm(imgData.data[i]);
    var g = gm(imgData.data[i+1]);
    var b = gm(imgData.data[i+2]);
    colStr += g + r + b;
  }
  // console.log(colStr);
  ws.send(colStr);
}

function gm (c) {
  var gc = Math.floor(Math.min(15,16*Math.pow(c/255, 1/2.2)));
  return gc.toString(16);
}

function stopLoop () {
  if (imgTimeout) {
    colIndex = 0;
    clearTimeout(imgTimeout);
  }
}
