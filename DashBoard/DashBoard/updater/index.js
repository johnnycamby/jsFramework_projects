
// Server Side of Socket.io

(function (updater) {
    
    var socketio = require('socket.io');

       updater.init = function (server) { 
    
        var io = socketio.listen(server);

        io.sockets.on('connection', function (socket) {
        
            console.log('socket was connected');
          //  socket.emit('showThis', 'this is from the server');
            
            socket.on('join category', function (category) {
            
                socket.join(category);
            });  

          // do a broadcast
            socket.on('newNote', function (data) {
            
                socket.broadcast.to(data.category).emit('broadcast note', data.note);
            });
        });
    };

})(module.exports);