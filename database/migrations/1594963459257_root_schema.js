'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RootSchema extends Schema {
  up () {
    this.create('roots', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('roots')
  }
}

module.exports = RootSchema
