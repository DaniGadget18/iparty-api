'use strict'
const Mensages = use("App/Models/mongo_Message");

class ChatController {

  async createMessage({ request, response }) {

    const {} = request.body;

    try {

      const data = Mensages.create({ });


      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(200).send({ status: 'error', error: e.message });
    }
  }

}

module.exports = ChatController
