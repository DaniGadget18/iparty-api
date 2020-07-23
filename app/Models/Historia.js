'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Historia extends Model {
  negocio() {
    return this.belongsTo('App/Models/Negocio', 'id', 'id_negocio')
  }
  usuario() {
    return this.belongsTo('App/Models/User', 'id_usuario', 'id')
  }

}

module.exports = Historia
