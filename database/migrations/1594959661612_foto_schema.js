'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FotoSchema extends Schema {
  up () {
    this.create('fotos', (table) => {
      table.increments()
      table.string('foto')
      table.integer('id_negocio', 80).unsigned().references('id').inTable('negocios')
      table.timestamps()
    })
  }

  down () {
    this.drop('fotos')
  }
}

module.exports = FotoSchema
