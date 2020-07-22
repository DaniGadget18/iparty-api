'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class horarios_negocios extends Model {
  static get table() {
    return 'horarios_negocios';
  }
  negocio() {
    return this.belongsTo('App/Models/Negocio', 'id', 'id_negocio');
  }
}

module.exports = horarios_negocios
