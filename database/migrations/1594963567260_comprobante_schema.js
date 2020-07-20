'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprobanteSchema extends Schema {
  up () {
    this.create('comprobantes', (table) => {
      table.increments()
      table.integer('id_negocio', 80).unsigned().references('id').inTable('negocios')
      table.string('comprobante', 100).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comprobantes')
  }
}

module.exports = ComprobanteSchema
