'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorariosNegocioSchema extends Schema {
  up () {
    this.create('horarios_negocios', (table) => {
      table.increments()
      table.integer('id_negocios', 80).unsigned().references('id').inTable('negocios')
      table.string('lunes', 80)
      table.string('martes', 80)
      table.string('miercoles', 80)
      table.string('jueves', 80)
      table.string('viernes', 80)
      table.string('sabado', 80)
      table.string('domingo', 80)
      table.timestamps()
    })
  }

  down () {
    this.drop('horarios_negocios')
  }
}

module.exports = HorariosNegocioSchema
