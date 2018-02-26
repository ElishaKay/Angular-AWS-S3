var dotenv = require('dotenv').config();
var dbconfig = require('./config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var express  = require('express');
var session  = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

var express = require('express'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



/**
 * Configuration
 */

// all environments
//for development
// app.set('port', process.env.PORT || 8000);

// for heroku
app.set('port', process.env.PORT || 80);


app.use(express.static(path.join(__dirname, '/')));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});


app.set('view engine', 'ejs');

// production only
if (app.get('env') === 'production') {
  // TODO
};

app.get('/s3creds',function(req,res){
    s3 = {};
    s3.region = process.env.REGION;
    s3.accessKeyId = process.env.ACCESSKEYID;
    s3.secretAccessKey = process.env.SECRETACCESSKEY;
    s3.bucket = process.env.BUCKET;
    s3.region = 'eu-central-1';
    res.json(s3); 
});


/**
 * Routes
 */

// Socket.io Communication

messages = [];
users = [];
connections = [];


io.sockets.on('connection', function(socket){


    connections.push(socket);
    console.log("connected: % of sockets connected", connections.length);
    
    console.log('this is the server talking');

    //Disconnect
    socket.on('disconnect', function(data){
        console.log('this is the socket.username.person',socket.username);

        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected % of sockets connected', connections.length);        
    });

    //Message
    socket.on('send message', function(data){
        messages.push(data);
        io.sockets.emit('new message', messages);
    });
    
    // new user
    socket.on('new user', function(data){
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
        updateMessages(messages);
        console.log('this is the users array',users);
    });

    function updateUsernames(){
        io.sockets.emit('get users', users)
    } 

    function updateMessages(messages){
        // io.sockets.emit('new message', messages);
    } 
});

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


var j = schedule.scheduleJob('42 * * * *', function(){
  console.log('The answer to life and love, the universe, and everything!');
});

// For deployment time
var port     = process.env.PORT || 80;

// for development
// var port     = 8000;

var passport = require('passport');
var flash    = require('connect-flash');

console.log(process.env.HOST);

require('./config/passport.js')(passport); 


// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));
app.use(require("body-parser").json())
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'kodizimcomisrunning',
    resave: true,
    saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// routes ======================================================================
// require('./app/email-template2.js')(app); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
// app.listen(port);
console.log('App is running on localhost:' + port);
