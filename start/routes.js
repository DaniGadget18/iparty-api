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
  Route.post('registrarNegocio', 'NegocioController.registrarNegocio');
  Route.get('obtenerNegocios', 'NegocioController.obtenerNegocios');
  Route.get('top', 'NegocioController.top');
}).prefix('api/negocio/')

Route.group( () => {
  Route.post('insertFotoNegocio', 'FotoController.insertFotoNegocio');
  Route.post('deleteFotoNegocio', 'FotoController.deleteFotoNegocio');
  Route.get('getFotoById', 'FotoController.getFotoById');
  Route.get('getFotoByNegocioId', 'FotoController.getFotoByNegocioId');
}).prefix('api/negocio/fotos/')

Route.group( () => {
  Route.post('updateEvento', 'EventoController.updateEvento');
  Route.post('createEvento', 'EventoController.createEvento');
  Route.get('getEventos', 'EventoController.getEventos');
  Route.get('getEventoById', 'EventoController.getEventoById');
  Route.get('getEventoByNegocioId', 'EventoController.getEventoByNegocioId');
  Route.post('deleteEvento', 'EventoController.deleteEvento');
}).prefix('api/negocio/eventos/')

Route.group( () => {
  Route.post('updateHorarioNegocio', 'HorariosNegocioController.updateHorarioNegocio');
  Route.post('createHorarioNegocio', 'HorariosNegocioController.createHorarioNegocio');
  Route.get('getHorarioByNegocioId', 'HorariosNegocioController.getHorarioByNegocioId');
}).prefix('api/negocio/horarios/')

Route.group( () => {
  Route.post('updateMenuById', 'MenuController.updateMenuById');
  Route.post('createMenu', 'MenuController.createMenu');
  Route.get('getMenuByNegocioId', 'MenuController.getMenuByNegocioId');
  Route.post('deleteMenuById', 'MenuController.deleteMenuById');
}).prefix('api/negocio/menus/')

Route.group( () => {
  Route.get('getCategorias', 'CategoriaController.getCategorias');
  Route.get('getCategoriaById', 'CategoriaController.getCategoriaById');
  Route.post('createCategoria', 'CategoriaController.createCategoria');
  Route.post('updateCategoria', 'CategoriaController.updateCategoria');
  Route.post('deleteCategoria', 'CategoriaController.deleteCategoria');
}).prefix('api/categoriasNegocios/')


