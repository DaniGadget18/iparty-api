'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const negocio = use("App/Models/Mnegocio");

class Fotos extends Model {
    negocio() {
        return this.belongsTo('App/Models/Negocio', 'id', 'id_negocio')
  }
}

module.exports = Fotos
