'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Message
 */
class Message extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'MessageHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * Message's schema
   */
  static get schema () {
    return {
      id_comverzacion: {type:Number, required:true},
      id_usuario: {type:Number},
      id_administrador:  {type:Number},
      id_negocio:  {type:Number, required:true},
      mensaje: {type:String, required:true},
    }
  }
}

module.exports = Message.buildModel('Message')
