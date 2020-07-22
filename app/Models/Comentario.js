'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comentario extends Model {
  static get table() {
    return 'comentarios';
  }
  negocio() {
    return this.belongsTo('App/Models/Negocio', 'id', 'id_negocio')
  }
}

module.exports = Comentario
