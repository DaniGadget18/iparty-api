'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CodigoSchema extends Schema {
  up () {
    this.create('codigos', (table) => {
      table.increments()
      table.string('correo', 60).notNullable()
      table.string('codigo', 60).notNullable()
      table.string('estado', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('codigos')
  }
}

module.exports = CodigoSchema
