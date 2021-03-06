'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NegocioSchema extends Schema {
  up () {
    this.create('negocios', (table) => {
      table.increments()
      table.string('foto', 80).nullable()
      table.string('nombre', 80).notNullable().unique()
      table.string('ubicacion', 80).nullable().unique()
      table.string('informacion', 80).nullable()
      table.decimal('lat', 10, 8).nullable()
      table.decimal('lng', 11, 8).nullable()
      table.integer('id_categoria', 80).unsigned().references('id').inTable('categorias')
      table.timestamps()
    })
  }

  down () {
    this.drop('negocios')
  }
}

module.exports = NegocioSchema
