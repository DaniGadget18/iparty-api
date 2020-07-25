'use strict'
const User = use('App/Models/User');

class ManagerController {

  static async obteneridNegocio ( email ) {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      return resp[0]['administradores'][0]['id'];

  }
}

module.exports = ManagerController
