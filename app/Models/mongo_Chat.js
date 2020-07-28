'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class mongo_Chat
 */
class mongo_Chat extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'mongo_ChatHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * mongo_Chat's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = mongo_Chat.buildModel('mongo_Chat')
