/*var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
 * 
 */

var http = require('http');
var express = require('express'); // for server startup
var app = express(); // singleton for webserver app
//var ejsEngine = require('ejs-locals');


// Setup the View Engine
//app.set('view engine', 'jade');
//app.engine('ejs', ejsEngine); // to support master pages
//app.set('view engine', 'ejs'); // ejs view engine
app.set('view engine', 'vash');

//app represents an object to do any requests and responses
app.get('/', function (req, res) {
//res.set('Content-Type', 'application/json');
// res.send('<html><body><h1>Express</h1> </body></html>');
// res.render('jade/index', { title: 'Express + Jade' });
// res.render('ejs/index', { title: 'Express + EJS' });
res.render('index', { title: 'Express + Vash' });
});

app.get('/api/users', function (req, res) {
    
    res.send({
        name : 'johnny',
        isValid : true,
        group : 'Admin'
    });
});

var server = http.createServer(app);

/*
 * function (req, res) {
    console.log(req.url);
    res.write('<html><body><h1>' + req.url + '</h1> </body></html>');
    res.end();
}
 */

server.listen(3000);