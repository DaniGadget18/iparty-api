'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Eventos extends Model {

  negocio() {
    return this.belongsTo('App/Models/Negocio', 'id_negocio', 'id')
  }
  
}

module.exports = Eventos
