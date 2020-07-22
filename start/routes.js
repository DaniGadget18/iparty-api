'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/api', () => {
  return { greeting: 'Hello' }
})


Route.group(() => {
 Route.post('login', 'SesionController.sesion');
 Route.post('signup', 'SesionController.registrar');
 Route.post('update', 'SesionController.editarusuario');
 Route.post('correo', 'SesionController.correo');

}).prefix('api/')




Route.group( () => {
  // Negocios
  Route.post('registrarNegocio', 'NegocioController.registrarNegocioLucid');
  Route.get('obtenerNegocios', 'NegocioController.obtenerNegocios');
  Route.get('obtenerNegocio', 'NegocioController.obtenerNegocioById');
  Route.post('editarNegocio', 'NegocioController.updateNegocio');

  // Horarios negocio
  Route.post('updateHorarioNegocio', 'NegocioController.updateHorarioNegocio');
  Route.post('createHorarioNegocio', 'NegocioController.createHorarioNegocio');

  // Fotos negocios
  Route.post('insertFotoNegocio', 'FotoController.insertFotoNegocio');
  Route.post('deleteFotoNegocio', 'FotoController.deleteFotoNegocio');
  Route.get('getFotoById', 'FotoController.getFotoById');
  Route.get('getFotoByNegocioId', 'FotoController.getFotoByNegocioId');

  // Menu negocio
  Route.post('updateMenuByNegocio', 'NegocioController.updateMenuByNegocio');
  Route.post('getAllMenuNegocioByNegocio', 'NegocioController.getMenuByNegocioId');


  // consultas
  Route.get('top', 'NegocioController.top');
  Route.post('registrarNegocio', 'NegocioController.registrarNegocio');
  Route.get('obtenerNegocios', 'NegocioController.obtenerNegocios');
  Route.get('top', 'NegocioController.top');
  Route.get('top5', 'NegocioController.getTop5')
  Route.get('getTop5ByCategoria', 'NegocioController.getTop5ByCategoria')
  Route.post('createComentario', 'NegocioController.createComentario')
}).prefix('api/negocio/')



