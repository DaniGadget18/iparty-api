'use strict'
const User = use('App/Models/User');
const Negocio = use('App/Models/Negocios');

class ManagerController {

  static async obteneridNegocio ( email ) {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      return resp[0]['administradores'][0]['id'];

  }

  static async tieneHorarioNegocio( id ){
    const negocio_horario = await Negocio.query().withCount('horarios').where('id', id).fetch();
    const data = negocio_horario.toJSON();
    return data[0]['__meta__']['horarios_count'];
  }
}


module.exports = ManagerController
