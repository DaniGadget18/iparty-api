'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Foo
 */
class Foo extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'FooHook.method')
    // Indexes:
    // this.index({}, {background: true})
    this.addHook('preSave', 'UserHook.notifyUpdate')
    this.index({ email: 1 }, { background: true })
  }
  /**
   * Foo's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = Foo.buildModel('Foo')
