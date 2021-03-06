var express = require('express'),
    path = require('path'),
    config = require('./config/config.js'),
    fs = require('fs'),
    os = require('os'),
    shelljs = require('shelljs/global'),
    PythonShell = require('python-shell')


    var app = express();
var scriptPath = path.join(__dirname,'views/script');
//Set views property
app.set('views',path.join(__dirname,'views'));
//set Template engine
app.engine('html',require('hogan-express'));
//Set it as View engine
app.set('view engine','html');

//Set Static public folder
app.use(express.static(path.join(__dirname,'views')));

//Set Port to run the app
app.set('port',process.env.PORT||4000);

//Setting config
app.set('host',config.host);

//Socket IO
//Create server which listen app 
var server = require('http').createServer(app);
//Socket.io is invoked by passing server 
var io = require('socket.io')(server);
var exec = require('child_process').exec;

//Routing
require('./routes/routes.js')(express,app,io,fs,exec,os,PythonShell,scriptPath);

//Listen server
server.listen(app.get('port'),function(){
        console.log('eSim Runing on port : '+app.get('port'));
})