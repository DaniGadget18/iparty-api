'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Modelcomentarios = use('App/Models/Mcomentario');

class Mnegocio extends Model {
  static get table() {
    return 'negocios';
  }
  comentarios () {
    return this.hasMany( 'App/Models/Mcomentario', 'id', 'id_negocios')
  }
  fotos () {
    return this.hasMany( 'App/Models/fotos', 'id', 'id_negocio')
  }
}

module.exports = Mnegocio
