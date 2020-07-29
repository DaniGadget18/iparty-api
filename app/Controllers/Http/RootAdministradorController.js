'use strict'
const Negocio = use("App/Models/Negocios");
const User = use("App/Models/User");
const Administrador = use("App/Models/Administradores");
const { validate } = use("Validator");


class RootAdministradorController {
  // Metodos con Lucid
  async registrarNegocioLucid({ request, response }) {
    const { nombre, email, password, fecha_nacimiento, nombreAdmin } = request.all();
    const validation = await validate(request.all(), {
      nombre: 'required',
      email: 'required | email',
      password: 'required',
      fecha_nacimiento: 'required',
      nombreAdmin: 'required'
    });


    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: 'Falta un campo' })
    }

    try {
      const negocio = await Negocio.create({
        nombre
      });
      const usuario = await User.create({
        email,
        password,
        nombre: nombreAdmin,
        fecha_nacimiento
      });
      const administradores = await Administrador.create({
        id_usuario: usuario.id,
        id_negocio: negocio.id,
        id_rol: 1
      });

      return response.status(200).send({ status: 'ok', message: 'Negocio creado con exito', data: administradores })
    } catch (error) {
      return response.status(400).send({ status: 'error', message: 'Hubo un error', error: error })
    }
  }

  async obtenerNegocios({ response }) {
    try {
      const negocios = await Negocio.all();
      console.log(negocios.length);
      return response.status(200).send({ status: 'ok', data: negocios });
    } catch (e) {
      return response.status(400).send({ status: 'ok', message: 'Hubo un error' });
    }
  }

  async obtenerNegocioByID({ request, response }) {
    const { id } = request.all();

    const validation = await validate(request.all(), {
      id: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: "Falta mandar el id" })
    }

    try {
      const negocio = await Negocio.query().with('categoria_negocio').with('usuario').where('id', id).fetch();
      return response.status(200).send({ "status": 'ok', data: negocio })
    } catch (error) {
      console.log(error);
      return response.status(400).send({ status: 'error', message: "Hubo un error", "error": error.message })
    }
  }

  async registrarRoot({request, response }) {
    const { email, password, nombre, fecha_nacimiento } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
      password: 'required',
      nombre: 'required',
      fecha_nacimiento: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: "Falta algun campo" })
    }

    try {
      const usuario = await User.create({
        email,
        password,
        nombre,
        fecha_nacimiento
      });
      const root = await usuario
        .root()
        .create({})
      return response.status(200).send({ status: 'ok', data: usuario });
    } catch (error) {
      return response.status(400).send({ status: 'error', message: "Hubo un error", "error": error.message })
    }

  }

  async obtenerAdministradoresRoot({ response, request }) {
    try {
      const roots = await User.query().has('root').fetch();
      return response.status(200).send({ status: 'ok', data: roots });
    } catch (error) {
      return response.status(400).send({ status: 'error', message: "Hubo un error", "error": error.message })
    }
  }




}

module.exports = RootAdministradorController
