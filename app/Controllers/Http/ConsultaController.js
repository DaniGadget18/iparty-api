'use strict'

//const mongo_User = require("../../Models/test");

const Negocio = use("App/Models/Negocios");
const Categoria = use("App/Models/Categorias");
const { validate } = use("Validator");
const Comentario = use("App/Models/Comentario");
//const User_mongo = use("App/Models/test")


class ConsultaController {

  async cat({ response }) {
    const neg = await Negocio.query().with('comentarios.usuario').with('fotos').with('horarios').with('categoria_negocio').with('menu.categoria').fetch();

    const cat = await Categoria.all();
    const p = [];
    var aux;
    var auxa;
    var myObj = {};
    var result = [];

    for (let i in cat.rows) {
      const pp = [];
      p.push(cat.rows[i]['categoria'])
      aux = cat.rows[i]['categoria'];
      auxa = cat.rows[i]['id'];

      for (let i in neg.rows) {
        if (neg.rows[i]['id_categoria'] == auxa) {
          pp.push(neg.rows[i])
        }
      }
      myObj[aux] = pp;

    }
    result.push(JSON.parse(JSON.stringify(myObj)));
    var asd = {};

    for (let i in cat.rows) {
      const ppt = [];
      p.push(cat.rows[i]['categoria'])
      aux = cat.rows[i]['categoria'];
      auxa = cat.rows[i]['id'];

      for (let i in result) {
        var obj = JSON.parse(JSON.stringify(result), function (key, value) {
          if (key == aux) {
            console.log("yeajjs", key)
            asd[aux] = JSON.parse(JSON.stringify(result.rows[0]))
          } else {
            return value;
          }
        });
      }
    }
    return response.status(200).send({ message: 'Negocio editado con exito', data: obj })
  }

  async top({ response }) {
    const categorias = await Categoria.query()
      .with('negocios.comentarios.usuario')
      .with('negocios.fotos')
      .with('negocios.menu.categoria')
      .fetch();
    //const negocios = await Negocio.find(15);
    //const negocio_comentario = await Negocio.query().with('comentarios').with('fotos').with('menu').fetch();
    //const comentarios = await comentario.profile().first();
    return response.status(200).send({ message: 'Negocio editado con exito', data: categorias })


    /*const categorias = await Categoria.query()
      .with('negocios.comentarios.usuario')
      .with('negocios.fotos')
      .with('negocios.menu.categoria')
      .with('negocios.categoria_negocio')
      .fetch();*/
    //const negocios = await Negocio.find(15);
    //const negocio_comentario = await Negocio.query().with('comentarios').with('fotos').with('menu').fetch();
    //const comentarios = await comentario.profile().first();

    return response.status(200).send({ message: 'HOLI', data: myObj })

  }

  async getTop5({ response }) {

    const data = await Negocio
      .query()
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu.categoria')
      .with('historias.usuario')
      .with('comentarios')
      .with('comentarios.usuario')
      .orderBy('popularidad', 'desc')
      .limit(5)
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });

  }

  async getTop5ByCategoria({ request, response }) {

    const data = await Negocio
      .query()
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('id_categoria', request.body['id_categoria'])
      .orderBy('popularidad', 'desc')
      .limit(5)
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async createComentario({ request, response }) {
    const { id_negocio, id_usuario, comentario, calificacion } = request.all();

    const validation = await validate(request.all(), {
      id_negocio: 'required',
      id_usuario: 'required',
      comentario: 'required',
      calificacion: 'integer|required|max:1',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      //guargar comentario
      const comentari = new Comentario();
      comentari.id_negocio = id_negocio
      comentari.id_usuario = id_usuario
      comentari.comentario = comentario
      comentari.calificacion = calificacion
      await comentari.save();

      //actualizar popularidad del negocio
      const count = await Comentario
        .query().where('id_negocio', id_negocio).count('* as cantidad')
      const sum = await Comentario
        .query().where('id_negocio', id_negocio).sum('calificacion as suma')
      const NuevaPopularidad = sum[0].suma / count[0].cantidad
      const negocio = await Negocio
        .query()
        .where('id', id_negocio)
        .update({
          popularidad: NuevaPopularidad,
        })
      return response.status(200).send({ message: 'Comentatio guardado con exito', data: comentari })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }

  }

  async getBusqueda({ request, response }) {

    const data = await Negocio
      .query()
      .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('nombre', 'LIKE', '%' + request.body['data'] + '%')
      .orWhere('ubicacion', 'LIKE', '%' + request.body['data'] + '%')
      .orWhere('categorias.categoria', 'LIKE', '%' + request.body['data'] + '%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async getBares({ response }) {

    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%bar%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(200).send({ status: 'ok', error: e.message });
    }
  }
  async getAntros({ response }) {

    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%antro%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(200).send({ status: 'ok', error: e.message });
    }
  }

  async getCantinas({ response }) {

    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%cantina%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(200).send({ status: 'ok', error: e.message });
    }
  }

  async getBillar({ response }) {
    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%billar%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(200).send({ status: 'ok', error: e.message });
    }
  }

  async getClubs({ response }) {

    try {

      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%club%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(200).send({ status: 'ok', error: e.message });
    }
  }


  async comentariosranked({ response, request }) {
    const { id_negocio, rank } = request.all();

    try {
      const negocio = await Comentario.query().with('usuario').where("id_negocio", id_negocio).where("calificacion", rank).fetch();
      const count = await Negocio
        .query()
        .withCount('comentarios').where("id", id_negocio).where("calificacion", rank)
        .fetch()
      const asd =count.toJSON();
   
      console.log(asd[0]["__meta__"]["comentarios_count"]);
      if (asd[0]["__meta__"]["comentarios_count"]==0) {
        return response.send({
          status: "ok", message: 'No tiene comentarios'
        });
      }
      else {
        return response.status(200).send({ status: 'ok', data: negocio })
      }

    } catch (error) {
      return response.send({
        status: "error", message: 'Hubo un error', error: error.message
      });

    }




  }

}

module.exports = ConsultaController
