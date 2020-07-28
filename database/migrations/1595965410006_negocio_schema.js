'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NegocioSchema extends Schema {
  up () {
    this.table('negocios', (table) => {
      // alter table
      table.dropUnique('ubicacion')
    })
  }

  down () {
    this.table('negocios', (table) => {
      // reverse alternations
    })
  }
}

module.exports = NegocioSchema
