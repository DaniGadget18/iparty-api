'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComentarioSchema extends Schema {
  up () {
    this.create('comentarios', (table) => {
      table.increments()
      table.integer('id_negocios', 80).unsigned().references('id').inTable('negocios')
      table.integer('id_usuario').unsigned().references('id').inTable('users')
      table.string('comentario', 100).notNullable()
      table.integer('calificacion').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comentarios')
  }
}

module.exports = ComentarioSchema
