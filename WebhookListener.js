#!/usr/bin/env nodejs
var http = require('http');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database("Database.db");
var exec = require('child_process').execSync;
var fs = require('fs');
var async = require('async');

var server = http.createServer(function(req, res) {
    var data = "";

    if (req.method == "POST") {
        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            data = JSON.parse(data);
            if (data.ref.substring(0,10) == "refs/heads") {
                var commit = data.head_commit.id.substring(0,7);
                var message = data.head_commit.message;
                var branch = data.ref.substring(11);
                if (message.length > 75) {
                    message = data.head_commit.message.substring(0,75);
                    message += "..."
                }
                var date = new Date(data.head_commit.timestamp);
                var millis = date.getTime();
                date = date.getFullYear() + "-" +  (date.getMonth() + 1) + "-" + date.getDate();
                message = message.split("\n")[0];
                var com = "INSERT INTO BUILDS VALUES('Luma-" + commit + ".zip','" + commit + "','" + data.head_commit.url + "','" + date + "',\"" + message + "\"," + millis + ",\"" + branch + "\");"
                console.log(com);
                db.exec(com);
                exec("./BuildScript.sh " + commit + " " + branch);
                console.log("Build Complete");

                fs.unlink("../Luma3DS-Site/index.html");

                fs.appendFileSync("../Luma3DS-Site/index.html", fs.readFileSync("../Luma3DS-Site/top.html"));

                db.all("SELECT * FROM BUILDS", function(err, rows) {
                    rows.reverse();
                    rows.forEach(function (row) {
                        fs.appendFileSync("../Luma3DS-Site/index.html", "<tr><td nowrap><a href=/Luma3DS/builds/Luma3DS-" + row.COMMIT + ".zip>Luma3DS-" + row.COMMIT + ".zip</a></td><td nowrap><a href=" + row.COMMITURL + ">" + row.COMMIT + "</a></td><td nowrap>" + row.BRANCH + "</td><td nowrap>" + row.DATE + "</td><td>" + row.MESSAGE + "</td></tr>\n");
                    });
                    fs.appendFileSync("../Luma3DS-Site/index.html", fs.readFileSync("../Luma3DS-Site/bottom.html"));
                    exec("./CommitScript.sh");
                });
            }
        });
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
});

server.listen(9001);
