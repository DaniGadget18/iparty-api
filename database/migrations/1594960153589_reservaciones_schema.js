'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReservacionesSchema extends Schema {
  up () {
    this.create('reservaciones', (table) => {
      table.increments()
      table.integer('id_usuario', 80).unsigned().references('id').inTable('users')
      table.integer('id_negocio', 80).unsigned().references('id').inTable('negocios')
      table.datetime('dia').notNullable()
      table.string('confirmacion', 80).notNullable().defaultTo('PENDIENTE')
      table.integer('personas', 80).notNullable()
      table.string('zona', 80).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('reservaciones')
  }
}

module.exports = ReservacionesSchema
