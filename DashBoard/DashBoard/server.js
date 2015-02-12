/*
 * http://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0
 * https://github.com/expressjs
 */


var http = require('http');
var express = require('express'); // for server startup
var session = require('express-session');
var bodyParser = require('body-parser');
var controllers = require('./controllers');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

var app = express(); // singleton for webserver app

// Setup the view engine
app.set('view engine', 'vash');

// Opt into Services
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'xplicit cat',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());


// Setup the public static resource folder
app.use(express.static(__dirname + '/public'));

// Use authentication
var auth = require('./auth');
auth.init(app);


// Map the routes
controllers.init(app);



app.get('/api/users', function (req, res) {

    res.send({
        name : 'johnny',
        isValid : true,
        group : 'Admin'
    });
});

/*
app.get('/api/sql', function (req, res) { 

    var msnodesql = require('msnodesql');
    var connString = 'Driver={SQL Server Navite Client 12.0};Server=.\\sqlexpress12;Database=Northwind;Trusted_connection={Yes}';

    msnodesql.query(connString, 'SELECT * FROM Customers', function (err, results) { 
      // Error Handling
        res.send(results);
    });
});

*/
var server = http.createServer(app);

server.listen(3000);

// WebSockets
// Socket.io attaches to the server object to listen to its messages
var updater = require('./updater');
updater.init(server); 