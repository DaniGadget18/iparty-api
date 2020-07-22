'use strict'
const { validate } = use("Validator");
const Database = use("Database");
const User = use("App/Models/User");
const Negocio = use("App/Models/Negocio");
const Categoria = use("App/Models/Categoria");
const Evento = use("App/Models/Eventos");
const Menu = use("App/Models/Menu");
const HorarioNegocio = use("App/Models/HorariosNegocio");
const Foto = use("App/Models/Foto");
const Hash = use('Hash');

class MenuController {

  async updateMenuById({request, response}) {
    const { id, id_negocio, id_categoria, nombre, informacion} = request.all();

    const validation = await validate(request.all(), {
      id : 'required',
      id_negocio : 'required',
      nombre: 'required',
      informacion: 'required',
      id_categoria: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const menu = await Menu
      .query()
      .where('id', id) 
      .update({
        id_negocio : id_negocio,
        nombre: nombre,
        informacion: informacion,
        id_categoria: id_categoria
      })
      const editada = await Menu.query().where('id', id).fetch()
      return response.status(200).send({message:'Informacion editada con exito', data:editada})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async createMenu({request, response}) {
    const { id_negocio, id_categoria, nombre, informacion} = request.all();

    const validation = await validate(request.all(), {
      id_negocio : 'required',
      nombre: 'required',
      informacion: 'required',
      id_categoria: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const menu = new Menu();
      menu.id_negocio = id_negocio,
      menu.nombre = nombre,
      menu.informacion = informacion,
      menu.id_categoria = id_categoria,
      await menu.save();
      return response.status(200).send({message:'Informacion guardada con exito', data:menu})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async getMenuByNegocioId({request, response}){

    try {
      const menu = await Menu.query().where('id_negocio', request.body['id_negocio']).fetch()
      return response.status(200).send({data:menu})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

  async deleteMenuById({request,response}){
    const menu = await Menu.find(request.body['id'])
    await menu.delete()
    return response.status(200).send({message:'Categoria eliminada con exito', data:menu})
  }

}

module.exports = MenuController
