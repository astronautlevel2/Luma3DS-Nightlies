var http = require('http')

var server = http.createServer(function(req, res) {
    var data = "";

    if (req.method == "POST") {
        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            data = JSON.parse(data);
            if (data.ref == "refs/heads/master") {
                console.log("Commit");
                console.log("Commit hash: " + data.head_commit.id.substring(0,7));
                console.log("Commit date: " + data.head_commit.timestamp);
                console.log("Commit message: " + data.head_commit.message);
                console.log("Commit url: " + data.head_commit.url);
            }
        });
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
});

server.listen(9001);
