'use strict'

const SesionController = require("../app/Controllers/Http/SesionController")

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws')
const server = use('Server')
const io = use('socket.io')(server.getInstance())
const WSController = use('App/Controllers/Http/ChatController')
io.on('connection', function (socket) {
    WSController.goChat(socket, io)
   });


