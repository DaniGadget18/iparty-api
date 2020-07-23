'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Negocios extends Model {
  static get table() {
    return 'negocios';
  }
  comentarios () {
    return this.hasMany( 'App/Models/Comentario', 'id', 'id_negocio')
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
  categoria_negocio() {
    return this.belongsTo('App/Models/Categorias', 'id_categoria', 'id');
  }
  usuario() {
    return this.belongsToMany('App/Models/User', 'id_negocio', 'id_usuario', 'id', 'id')
      .pivotTable('administradores');
  }
  historias() {
    return this.hasMany( 'App/Models/Historia', 'id', 'id_negocio')
  }
}

module.exports = Negocios
