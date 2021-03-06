'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Categorias extends Model {
  static get table() {
    return 'categorias';
  }
  negocios () {
    return this.hasMany( 'App/Models/Negocios', 'id', 'id_categoria')
  }
}

module.exports = Categorias
