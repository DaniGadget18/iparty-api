'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NegocioAddSchema extends Schema {
  up () {
    this.table('negocios', (table) => {
      // alter table
      table.integer('popularidad').defaultTo('0').notNullable();
    })
  }

  down () {
    this.table('negocios', (table) => {
      // reverse alternations
    })
  }
}

module.exports = NegocioAddSchema
