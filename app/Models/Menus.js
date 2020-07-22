'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Menus extends Model {
    negocio() {
        return this.belongsTo('App/Models/Negocio', 'id_negocio', 'id')
  }
  categoria() {
    return this.belongsTo('App/Models/Categoriamenu', 'id_categoria', 'id')
}
}

module.exports = Menus
