'use strict'

/** @type {typeof import('./node_modules/@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Administradores extends Model {
  static get table() {
    return 'administradores';
  }

}

module.exports = Administradores
