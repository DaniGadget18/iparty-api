'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RootSchema extends Schema {
  up () {
    this.create('roots', (table) => {
      table.increments()
      table.integer('id_usuario').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('roots')
  }
}

module.exports = RootSchema
