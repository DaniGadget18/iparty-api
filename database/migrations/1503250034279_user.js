'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 45).notNullable().unique()
      table.string('nombre', 45).notNullable()
      table.string('apellidoP', 45).notNullable()
      table.string('apellidoM', 45)
      table.string('foto', 45).notNullable()
      table.date('fecha_nacimiento', 254).notNullable()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
