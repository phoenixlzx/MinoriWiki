var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime"),
    config = require('./config')();


module.exports = function (port) {

    http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname,
	    filename = path.join(process.cwd(), config['dir'].site, uri);

	fs.exists(filename, function(exists) {
	    if(!exists) {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found\n");
		response.end();
		return;
	    }

	    if (fs.statSync(filename).isDirectory())
		filename += '/index.html';

	    fs.readFile(filename, "binary", function(err, file) {
		if(err) {
		    response.writeHead(500, {"Content-Type": "text/plain"});
		    response.write(err + "\n");
		    response.end();
		    return;
		}

		response.writeHead(200, {"Content-Type": mime.lookup(filename)});
		response.write(file, "binary");
		response.end();
	    });
	});
    }).listen(parseInt(port, 10));
    console.log("static file server running at http://localhost:" + port + "/" + "\nCTRL + C to shutdown");
};
