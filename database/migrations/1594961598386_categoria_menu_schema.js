'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategoriaMenuSchema extends Schema {
  up () {
    this.create('categoria_menus', (table) => {
      table.increments()
      table.string('nombre', 45).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('categoria_menus')
  }
}

module.exports = CategoriaMenuSchema
