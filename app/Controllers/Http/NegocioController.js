'use strict'
const { validate } = use("Validator");
const Database = use("Database");
const User = use("App/Models/User");
const Hash = use('Hash');

class NegocioController {

  async obtenerNegocio({response, request}) {
    const { id } = request.all();
    const negocio = await Database
      .from('negocios')
      .where('id', id);

    try {
      return response.status(200).send({ status: 'ok', data: negocio });
    } catch (e) {
      return response.status(400).send({ status: 'error', error:e });
    }
  }

  async obtenerNegocios({response}) {
    const negocios = await Database
      .select('*')
      .from('negocios')

    try {
      console.log(negocios.length);
      return response.status(200).send({ status: 'ok', data: negocios });
    } catch (e) {

    }
  }

  async registrarNegocio({request, response}) {
    const { nombre, ubicacion, id_categoria, nombreAdmin, email, password } = request.all();

    const validation = await validate(request.all(), {
      nombre: 'required',
      ubicacion: 'required',
      id_categoria: 'required',
      nombreAdmin: 'required',
      email: 'required|email',
      password: 'required|min:5'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    const negocio = await Database.from('users').where('nombre', nombre)
    if (!negocio) {
      return response.status(400).send("Negocio ya creado");
    }
    const userFound = await User.findBy("email", email);
    if (userFound) {
      return response.status(400).send("El usuario ya existe");
    }

    try {
      const negocio = await Database
        .table('negocios')
        .insert({nombre: nombre, ubicacion: ubicacion, id_categorias:id_categoria});
      const usuario = await Database
        .table('users')
        .insert({email: email, nombre: nombreAdmin, password:password });
      const datosUsuario = await Database
        .select('id')
        .from('users')
        .where('email', email);
      const datosNegocio = await Database
        .select('id')
        .from('negocios')
        .where('nombre', nombre);

      const administrador = await Database
        .table('administradores')
        .insert({id_usuario: datosUsuario[0].id, id_negocio: datosNegocio[0].id, id_rol:1 });
      console.log(usuario);


      return response.status(200).send({status:'ok', message:'Negocio y usuario creados con exito'})

    } catch (e) {
      return response.status(400).send({status:'error', type:e, message:'Hubo un error'})
    }


  }


}

module.exports = NegocioController
