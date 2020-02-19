var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};
let {
    PythonShell
} = require('python-shell')

socketApi.io = io;
var usernb = 0;


io.sockets.on('connection', function (socket, pseudo) {

    console.log('Un client se connecte');
    usernb = usernb + 1;

    //redirection vers google.fr si déjà une personne sur la page
    if (usernb > 1) {
        var destination = 'localhosr:8080';
        socket.emit('redirectWAIT_OK', destination);
        console.log("Y'a trop de monde ça degage...");
        console.log("redirection vers google.fr");
    }

    console.log('user number =' + usernb);
    socket.pseudo = usernb;

    socket.on('disconnect', function () {
        console.log('user disconnected');
        usernb = usernb - 1;
        console.log('user number =' + usernb);
    });


    socket.on('message', function (message) {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(time + ' : ' + message);

        // PYTHON SCRIPT CALL
        var pyshell = new PythonShell('script.py');

        pyshell.send(message);

        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
        });

        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err) {
                throw err;
            };

            console.log('finished\n');
        });
        //END PYTHON SCRIPT CALL
    });

    socket.on('redirectWAIT_plz', function (message) {
        console.log(time + ' me parle ! Il me dit : ' + message);

        var destination = 'localhost:8080';
        socket.emit('redirectWAIT_OK', destination);
        console.log("redirection /wait");
    });


});

//END

module.exports = socketApi;