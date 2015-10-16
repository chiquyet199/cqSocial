node.js

//Upload images

//Read and send img to client
//http://stackoverflow.com/questions/9540978/nodejs-how-to-read-and-output-jpg-image
// /http://stackoverflow.com/questions/26331787/socket-io-node-js-simple-example-to-send-image-files-from-server-to-client

var ctx = document.getElementById('canvas').getContext('2d');
var img = new Image();
    img.src = 'data:image/jpeg;base64,' + data;
    ctx.drawImage(img, 0, 0);
