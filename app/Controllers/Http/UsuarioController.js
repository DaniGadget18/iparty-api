'use strict'
const User = use("App/Models/User");
const Reservacion = use("App/Models/Reservacion");

class UsuarioController {

  async getReservaciones({ request, response }) {
    const { id } = request.all()

    try {

      const result = await Reservacion
      .query()
      .with('negocio')
      .where('id_usuario', id)
      .where('confirmacion', '!=', 'CANCELADO')
      .fetch()
      return response.status(200).send({ status: 'ok', data: result });

    } catch (error) {

      return response.status(400).send({ status: 'error', error: error.message });
    }

  }

  async obtenerUsuarioPorEmail({request, response}){

    const {email} = request.all()

    try {
      const usuario = await User.findBy('email', email)
      return response.status(200).send({ message: 'Encontrado con exito.', data: usuario })
    } catch (error) {
      return response.status(400).send({ message: 'ERROR', data: ex.message })
    }
  }

}

module.exports = UsuarioController
