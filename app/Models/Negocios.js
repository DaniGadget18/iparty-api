'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Negocios extends Model {
    comentarios () {
        return this.hasMany( 'App/Models/Mcomentario', 'id', 'id_negocio')
      }
      fotos () {
        return this.hasMany( 'App/Models/Fotos', 'id', 'id_negocio')
      }
      horarios () {
        return this.hasMany( 'App/Models/HorariosNegocio', 'id', 'id_negocio')
      }
      menu () {
        return this.hasMany( 'App/Models/Menus', 'id', 'id_negocio')
      }
      catagoria(){
        return this.belongsTo('App/Models/Categorias', 'id_categoria', 'id')
      }
      
}

module.exports = Negocios
