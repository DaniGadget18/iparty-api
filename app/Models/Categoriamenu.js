'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class categoria_menus extends Model {
  menu () {
    return this.hasMany( 'App/Models/Menus', 'id', 'id_categoria')
  }
}

module.exports = categoria_menus
