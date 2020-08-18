'use strict'
const { validate } = use("Validator");
const Categoria = use("App/Models/Categoria");
const CategoriaMenu = use("App/Models/Categoriamenu");

class CategoriaController {

  async obtenerCategorias( {response}) {
    try {
      const categorias = await Categoria.all()
      return response.status(200).send({ status: 'ok', data: categorias })
    } catch (error) {
      return response.status(400).send({ status: 'error', message: "Hubo un error", "error": error })
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

    const yaexiste = await Categoria.findBy("categoria",categoria)
    console.log(yaexiste)
    if (yaexiste) {
      return response.status(400).send({ message: "error", error:"Ya existe ese nombre." })
    }

    try {
      const categori = new Categoria();
      categori.categoria = categoria
      await categori.save();
      return response.status(200).send({message:'Categoria creada con exito', data:categori})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }

  }

  async deleteCategoria({request,response}){
    const { id } = request.all()
    const categoria = await Categoria.find(id)
    await categoria.delete()
    return response.status(200).send({message:'Categoria eliminada con exito', data:categoria})
  }

  async obtenerCategoriasMenu({ request, response }) {
    try {
      const categoriasMenu = await CategoriaMenu.all();
      return response.status(200).send({ status: 'ok', data: categoriasMenu })
    } catch (error) {
      return response.status(400).send({ status: 'error', message: 'algo salio mal', error: error.message })
    }
  }

  async createCategoriaMenu({request,response}){
    const { nombre } = request.all();

    const validation = await validate(request.all(), {
      nombre: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    const yaexiste = await CategoriaMenu.findBy("nombre", nombre)
    if (yaexiste) {
      return response.status(400).send({ message: "error", error:"Ya existe ese nombre." })
    }

    try {
      const categori = new CategoriaMenu();
      categori.nombre = nombre
      await categori.save();
      return response.status(200).send({message:'Categoria creada con exito', data:categori})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }

  }

  async deleteCategoriaMenu({request,response}){
    const { id } = request.all()
    const categoria = await CategoriaMenu.find(id)
    await categoria.delete()
    return response.status(200).send({message:'Categoria eliminada con exito', data:categoria})
  }

}

module.exports = CategoriaController
