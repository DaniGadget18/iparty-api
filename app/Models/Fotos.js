'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Fotos extends Model {
  static get table() {
    return 'fotos';
  }
  negocio() {
    return this.belongsTo('App/Models/Negocio', 'id', 'id_negocio')
  }
}

module.exports = Fotos
