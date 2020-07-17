'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdministradoresSchema extends Schema {
  up () {
    this.create('administradores', (table) => {
      table.increments()
      table.integer('id_usuario').unsigned().references('id').inTable('users')
      table.integer('id_negocios').unsigned().references('id').inTable('negocios')
      table.integer('id_roles').unsigned().references('id').inTable('roles')
      table.timestamps()
    })
  }

  down () {
    this.drop('administradores')
  }
}

module.exports = AdministradoresSchema
