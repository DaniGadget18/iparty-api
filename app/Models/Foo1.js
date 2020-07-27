'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Foo1
 */
class Foo1 extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'Foo1Hook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Foo1's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = Foo1.buildModel('Foo1')
