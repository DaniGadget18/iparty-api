'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.create('eventos', (table) => {
      table.increments()
      table.integer('id_negocio', 80).unsigned().references('id').inTable('negocios')
      table.datetime('fecha').notNullable()
      table.string('nombre', 80).notNullable()
      table.string('informacion', 200).nullable()
      table.string('foto').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('eventos')
  }
}

module.exports = EventoSchema
