'use strict'
const { validate } = use("Validator");
const Categoria = use("App/Models/Categoria");


class CategoriaController {

  async getCategorias({response}){

    try {
      const categorias = await Categoria.all();
      return response.status(200).send({data:categorias})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }


  }
  async getCategoriaById({request ,response}){

    try {
      const catagoria = await Categoria.query().where('id', request.body['id']).fetch()
      return response.status(200).send({data:catagoria})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

  async createCategoria({request,response}){
    const { categoria } = request.all();

    const validation = await validate(request.all(), {
      categoria: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }
    try {
      const categori = new Categoria();
      categori.name = categoria
      await categori.save();
      return response.status(200).send({message:'Categoria creada con exito', data:categori})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }

  }

  async updateCategoria({request,response}){

    const { id, categoria } = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
      categoria: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {
      const categoria = await Categoria
      .query()
      .where('id', id)
      .update({
        categoria : categoria,
      })
      const editada = await Store.query().where('id', id).fetch()
      return response.status(200).send({message:'Categoria editada con exito', data:editada})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }

  }

  async deleteCategoria({request,response}){
    const categoria = await Categoria.find(request.body['id'])
    await categoria.delete()
    return response.status(200).send({message:'Categoria eliminada con exito', data:categoria})
  }
}

module.exports = CategoriaController
