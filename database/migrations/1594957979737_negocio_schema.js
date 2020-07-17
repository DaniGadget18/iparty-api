'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NegocioSchema extends Schema {
  up () {
    this.create('negocios', (table) => {
      table.increments()
      table.string('nombre', 80).notNullable().unique()
      table.string('ubicacion', 80).notNullable().unique()
      table.string('informacion', 80).notNullable()
      table.integer('id_categorias', 80).unsigned().references('id').inTable('categorias')
      table.timestamps()
    })
  }

  down () {
    this.drop('negocios')
  }
}

module.exports = NegocioSchema
