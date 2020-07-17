'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MenuSchema extends Schema {
  up () {
    this.create('menus', (table) => {
      table.increments()
      table.integer('id_negocio', 80).unsigned().references('id').inTable('negocios')
      table.integer('id_categoria', 80).unsigned().references('id').inTable('categoria_menus')
      table.string('nombre', 45).notNullable()
      table.string('informacion', 100).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('menus')
  }
}

module.exports = MenuSchema
