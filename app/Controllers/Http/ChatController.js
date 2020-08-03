'use strict'


class ChatController {

  static goChat(socket,io){
    var messages = [];
    console.log('Alguien se ha conectado con Sockets');



    socket.on('join_room', ([room])=>{
      socket.join(room)
      console.log('Alguien entro a la sala');
    });

    socket.on('leave_room', (room)=>{
      socket.leave(room)
      console.log('Alguien salio de la sala');
    });

    socket.on('message', ({room,message})=>{
      io.sockets.to(room).emit('message',   {
        body: message.body,
        user: message.user
      });

      console.log(room, message);
    });
  }

  async allSalas()  {
    const salas = await Sala.all();
    return { data: salas};
  }

  async messagesFromSalas({request,response}){
    const {id} = request.all()
    const sala = await Sala.find(id);
    const messages = await sala.messages().fetch()
    return response.send({ data: messages});
  }

  async saveMessage({request,response}){
    const {user_id, sala_id, message} = request.all()
    const user = await User.find(user_id);
    const messageN = await user.messages().create({message: message, sala_id: sala_id, user_id: user_id})
    return response.send({ data: messageN});
  }

  async saveSala({request,response}){
    const sala = request.all()
    const newSala = new Sala()
    newSala.name = sala.name;
    await newSala.save()
    return response.send({ data: newSala});
  }

  async saveUser({request,response}){
    const user = request.all()
    const newUser = new User()
    newUser.username = user.username;
    await newUser.save()
    return response.send({ data: newUser});
  }

  async getUser({request,response}){
    const data = request.all()

    const user = await User.findBy('username', data.username)
    return response.send({ data: user.id});
  }

  async getUsername({request,response}){
    const data = request.all()

    const user = await User.find(data.id)
    return response.send({ data: user.username});
  }

  async getSala({request,response}){
    const data = request.all()

    const sala = await Sala.findBy('name', data.name)
    return response.send({ data: sala.id});
  }




}

module.exports = ChatController
