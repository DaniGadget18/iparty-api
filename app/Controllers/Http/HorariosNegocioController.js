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

class HorariosNegocioController {

  async updateHorarioNegocio({request, response}) {
    const { id_negocio , lunes, martes, miercoles, jueves, sabado, domingo } = request.all();

    const validation = await validate(request.all(), {
      id_negocio : 'required',
      lunes: 'required',
      martes: 'required',
      miercoles: 'required',
      jueves: 'required',
      viernes: 'required',
      sabado: 'required',
      domingo: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const horario = await HorarioNegocio
      .query()
      .where('id_negocio', request.body['id_negocio'])
      .update({
        lunes: lunes,
        martes: martes,
        miercoles: miercoles,
        jueves: jueves,
        viernes: viernes,
        sabado: sabado,
        domingo: domingo
      })
      const editada = await HorarioNegocio.query().where('id_negocio', request.body['id']).fetch()
      return response.status(200).send({message:'Informacion editada con exito', data:editada})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async createHorarioNegocio({request, response}) {
    const { id_negocio , lunes, martes, miercoles, jueves, sabado, domingo } = request.all();

    const validation = await validate(request.all(), {
      id_negocio : 'required',
      lunes: 'required',
      martes: 'required',
      miercoles: 'required',
      jueves: 'required',
      viernes: 'required',
      sabado: 'required',
      domingo: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const horario = new HorarioNegocio();
      horario.id_negocio = id_negocio,
      horario.lunes = lunes,
      horario.martes = martes,
      horario.miercoles = miercoles,
      horario.jueves = jueves,
      horario.viernes = viernes,
      horario.sabado = sabado,
      horario.domingo = domingo
      await horario.save();
      return response.status(200).send({message:'Horario creado con exito', data:horario})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async getHorarioByNegocioId({request, response}){

    try {
      const horario = await HorarioNegocio.query().where('id_negocio', request.body['id_negocio']).fetch()
      return response.status(200).send({data:horario})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

}

module.exports = HorariosNegocioController
