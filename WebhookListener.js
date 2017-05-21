#!/usr/bin/env nodejs
var http = require('http');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database("Database.db");

var server = http.createServer(function(req, res) {
    var data = "";

    if (req.method == "POST") {
        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            data = JSON.parse(data);
            if (data.ref == "refs/heads/master") {
                var commit = data.head_commit.id.substring(0,7);
                var com = "INSERT INTO BUILDS VALUES('Luma-" + commit + ".zip','" + commit + "','" + data.head_commit.url + "','" + data.head_commit.timestamp + "','" + data.head_commit.message + "');"
                console.log(com)
                db.exec(com);
            }
        });
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
});

server.listen(9001);
