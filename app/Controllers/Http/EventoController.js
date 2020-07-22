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

class EventoController {

  async updateEvento({request, response}) {
    const { id, id_negocio , fecha, nombre, informacion, foto} = request.all();

    const validation = await validate(request.all(), {
      id : 'required',
      id_negocio : 'required',
      fecha: 'required',
      nombre: 'required',
      informacion: 'required',
      foto: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const editada = await Evento
      .query()
      .where('id', id)
      .update({
        fecha: fecha,
        nombre: nombre,
        informacion: informacion,
        foto: foto,
      })
      const editada = await Evento.query().where('id', id).fetch()
      return response.status(200).send({message:'Informacion editada con exito', data:editada})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async createEvento({request, response}) {
    const { id_negocio , fecha, nombre, informacion, foto} = request.all();

    const validation = await validate(request.all(), {
      id_negocio : 'required',
      fecha: 'required',
      nombre: 'required',
      informacion: 'required',
      foto: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const evento = new Evento();
      evento.id_negocio = id_negocio
      evento.fecha = fecha,
      evento.nombre = nombre,
      evento.informacion = informacion,
      evento.foto = foto,
      await categori.save();
      return response.status(200).send({message:'Evento creado con exito', data:evento})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async getEventos({response}){

    try {
      const eventos = await Evento.all();
      return response.status(200).send({data:eventos})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }


  }
  async getEventoById({request, response}){

    try {
      const evento = await Evento.query().where('id', request.body['id']).fetch()
      return response.status(200).send({data:evento})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

  async getEventoByNegocioId({request, response}){

    try {
      const evento = await Evento.query().where('id_negocio', request.body['id_negocio']).fetch()
      return response.status(200).send({data:evento})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

  async deleteEvento({request,response}){
    const evento = await Evento.find(request.body['id'])
    await evento.delete()
    return response.status(200).send({message:'Categoria eliminada con exito', data:evento})
  }

}

module.exports = EventoController
