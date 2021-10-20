const fs = require('fs')
const express = require('express');
const Rcon = require('rcon');
const favicon = require('serve-favicon')
const path = require('path')
const credentials = require('./credentials.json');
var rcon = new Rcon(credentials.host, credentials.port, credentials.password);
const people = require('./people.json');
var commandResult = null;
var authenticated = false;
var queuedCommands = [];
//var rconError = null;
const app = express();

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

rcon.on('auth', function () {
    console.log("Authenticated");
    authenticated = true;

    // You must wait until this event is fired before sending any commands,
    // otherwise those commands will fail.
    //
    // This example buffers any commands sent before auth finishes, and sends
    // them all once the connection is available.

    for (var i = 0; i < queuedCommands.length; i++) {
        rcon.send(queuedCommands[i]);
    }
    queuedCommands = [];

}).on('response', function (str) {
    commandResult = str;
    console.log("Response: " + str);
    /* res.render('console-execute', {
         title: "Console",
         result: commandResult
     });
     */
}).on('error', function (err) {
    commandResult = err;
    console.log(err);
}).on('end', function () {
    console.log("Connection closed");
    //process.exit();
});
if(credentials["enable rcon"] == true){
    console.log("Authenticating...");
    rcon.connect();
}

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Minecraft Server Manager',
        people: people.profiles
    });
});
app.get('/console/execute', (req, res) => {
    var command = req.query.command;
    
    if (authenticated) {
        rcon.send(command);
      } else {
        queuedCommands.push(command);
        commandResult = "Server Unavailable... Command Queued"
        if(credentials["enable rcon"] == true){
            console.log("Authenticating...");
            rcon.connect();
        }
      }
    res.redirect('/console')
});

app.get('/console', (req, res) => {
    res.render('console', {
        title: "Console",
        result: commandResult
    });
    commandResult = null;
});
app.get('/profile', (req, res) => {
    const person = people.profiles.find(p => p.id === req.query.id);
    res.render('profile', {
        title: `About ${person.firstname} ${person.lastname}`,
        person,
    });
});
/*app.get('/favicon.ico', (req, res) =>{
    res.render('favicon.ico')
})
*/
app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
 });
const server = app.listen(credentials.webPort, () => {
    console.log(`Express running → PORT ${server.address().port}`);
})

