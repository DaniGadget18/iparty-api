'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comentario extends Model {
  static get table() {
    return 'comentarios';
  }
  negocio() {
        return this.belongsTo('App/Models/Negocio', 'id_negocio', 'id')
  }
  usuario(){
    return this.belongsTo('App/Models/User', 'id_usuario', 'id')
  }
}

module.exports = Comentario
