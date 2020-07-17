'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoriaSchema extends Schema {
  up () {
    this.create('historias', (table) => {
      table.increments()
      table.integer('id_usuario').unsigned().references('id').inTable('users')
      table.integer('id_negocios').unsigned().references('id').inTable('negocios')
      table.integer('duracion').notNullable()
      table.string('url_file', 100).notNullable()
      table.string('url_miniatura', 100).notNullable()
      table.string('descripcion', 150).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('historias')
  }
}

module.exports = HistoriaSchema
