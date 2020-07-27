'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class EventsSchema extends Schema {
  up () {
    // copy data
    this.schedule(async (trx) => {
      await Database.raw("SET GLOBAL event_scheduler = ON;");
      await Database.raw("CREATE EVENT limpieza_historia ON SCHEDULE EVERY 1 second DO DELETE FROM iparty.historias WHERE created_at < (CURRENT_TIMESTAMP - INTERVAL 1 DAY);");
    })

  }

  down () {
    this.schedule(async (trx) => {
      await Database.raw("DROP EVENT IF EXISTS limpieza_historia;");
    })
  }
}

module.exports = EventsSchema
