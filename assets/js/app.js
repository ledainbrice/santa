/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    console.log('Connecting to Sails.js...');
    console.log(this);
    //socket.broadcast('room', {data:'donnees'});
  }

  socket.on('connect', function socketConnected() {

    console.log("This is from the connect: ");
//////////////////////////////////////////////
    io.socket.get('/user/index', function (resData) {
      console.log(resData);
  });

  });
  io.socket.on('user', function(event){
    console.log(event);});


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);


