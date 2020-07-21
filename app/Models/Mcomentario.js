'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const negocio = use("App/Models/Mnegocio");

class Mcomentario extends Model {
  static get table() {
    return 'comentarios';
  }
  negocio() {
        return this.belongsTo('Mnegocio', 'id', 'id_negocio')
  }
}

module.exports = Mcomentario
