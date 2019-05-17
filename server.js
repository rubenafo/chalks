
// HTTP Portion
var http = require('http');
// Path module
var path = require('path');

// Using the filesystem module
var fs = require('fs');

function handleRequest(req, res) {
  var pathname = req.url;
  if (pathname == '/') {
    pathname = '/index.html';
  }
  var ext = path.extname(pathname);
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };
  var contentType = typeExt[ext] || 'text/plain';
  fs.readFile(__dirname + pathname, "utf-8",
    
    function (err, data) {
      let sketchFile = process.argv[2]
      if (pathname === "/index.html") {
        if (sketchFile) {
          data = data.replace("sketch.js", sketchFile)
          console.log("Rendering", sketchFile, "...")
        }
        else {
          console.log ("Rendering default sketch.js ...")
        }
      }
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
        server.close()
      }
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    },
  );
}

var server = http.createServer(handleRequest);
server.listen(9090);

console.log('Server started on port 9090');
