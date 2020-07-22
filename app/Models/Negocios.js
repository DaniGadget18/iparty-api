'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Negocios extends Model {
    comentarios () {
        return this.hasMany( 'App/Models/Mcomentario', 'id', 'id_negocio')
      }
      fotos () {
        return this.hasMany( 'App/Models/fotos', 'id', 'id_negocio')
      }
      horarios () {
        return this.hasMany( 'App/Models/HorariosNegocio', 'id', 'id_negocio')
      }
      menu () {
        return this.hasMany( 'App/Models/Menus', 'id', 'id_negocio')
      }
}

module.exports = Negocios
