'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const negocio = use("App/Models/Mnegocio");

class Mcomentario extends Model {
  profile() {
        return 1
      }
}

module.exports = Mcomentario
