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

class FotoController {

  async insertFotoNegocio({request, response}) {
    const { id_negocio , foto } = request.all();

    const validation = await validate(request.all(), {
      id_negocio : 'required',
      foto: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const fotoN = new Foto();
      fotoN.id_negocio = id_negocio
      fotoN.foto = foto
      await fotoN.save();
      return response.status(200).send({message:'Foto creada con exito', data:fotoN})

    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async deleteFotoNegocio({request, response}) {

    try {
      const foto = await Foto.find(request.body['id'])
      await foto.delete()
      return response.status(200).send({message:'Foto eliminada con exito', data:store})

    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async getFotoById({request ,response}){

    try {
      const foto = await Foto.query().where('id', request.body['id']).fetch()
      return response.status(200).send({data:foto})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

  async getFotoByNegocioId({request ,response}){

    try {
      const foto = await Foto.query().where('id_negocio', request.body['id_negocio']).fetch()
      return response.status(200).send({data:foto})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

}

module.exports = FotoController
