'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class mongo_Message
 */
class mongo_Message extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'mongo_MessageHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * mongo_Message's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = mongo_Message.buildModel('mongo_Message')
