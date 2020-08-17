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
 Route.get('check', 'SesionController.checkAuth');
 Route.post('newToken', 'SesionController.newToken');
 Route.post('login', 'SesionController.sesion');
 Route.post('signup', 'SesionController.registrar');
 Route.post('update', 'SesionController.editarusuario');
 Route.post('correo', 'SesionController.correo');
 Route.post('usuario', 'SesionController.usuario');

}).prefix('api/')

Route.group( () => {
  Route.get('obtenerNegocios', 'RootAdministradorController.obtenerNegocios');
  Route.get('administradoresroot', 'RootAdministradorController.obtenerAdministradoresRoot');
  Route.post('obtenerNegociobyid', 'RootAdministradorController.obtenerNegocioByID');
  Route.post('registrarNegocio', 'RootAdministradorController.registrarNegocioLucid');
  Route.post('registrarRoot', 'RootAdministradorController.registrarRoot');
  Route.post('existeNegocio', 'NegocioController.existeNegocio');
  Route.post('eliminarUsuario', 'RootAdministradorController.elimiarAdministrador');


}).prefix('api/root/').middleware('checktoken');

Route.group( () => {
  Route.post('reservaciones', 'UsuarioController.getReservaciones');

}).prefix('api/usuario/').middleware('checktoken');

Route.group( () => {
  //Panel de Control
  Route.post('comentariosPorEstrellas', 'ConsultaController.comentariosPorEstrellas');
  Route.post('reservacionesDia', 'ConsultaController.reservacionesDia');
  Route.post('reservacionesDiaSemana', 'ConsultaController.reservacionesDiaSemana');
  Route.post('promedioPopu', 'ConsultaController.promedioPopu');
  Route.post('totalComentarios', 'ConsultaController.totalComentarios');

  // Negocios
  Route.post('obteneridnombrenegocio', 'NegocioController.obteneridnombrenegocio');
  Route.post('obtenerNegocio', 'NegocioController.obtenerNegocioByEmail');
  Route.post('editarNegocio', 'NegocioController.updateNegocio');

  // Categorias
  Route.get('Categorias', 'NegocioController.obtenerCategorias');

  // Horarios negocio
  Route.post('updateHorarioNegocio', 'NegocioController.updateHorarioNegocio');

  // Fotos negocios
  Route.post('subirfoto', 'FotoController.subirFotosNegocio');
  Route.post('getFotoByNegocioEmail', 'FotoController.getFotoByNegocioEmail');
  Route.post('eliminarFotoNegocio', 'FotoController.eliminarFotoNegocio');
  Route.get('getFotoById', 'FotoController.getFotoById');

  // Menu negocio
  Route.post('updateMenuByNegocio', 'NegocioController.updateMenuByNegocio');
  Route.post('getAllMenuByNegocio', 'NegocioController.getMenuByNegocioEmail');
  Route.get('getAllCategorias', 'NegocioController.obtenerCategoriasMenu');
  Route.post('registrarProductoNegocio', 'NegocioController.registrarProductoNegocio');
  Route.post('obtenerMenuid', 'NegocioController.obtenerMenubyID');
  Route.post('eliminarProducto', 'NegocioController.eliminarProducto');

  // Eventos negocio
  Route.post('obtenerEventos', 'NegocioController.obtenerEventosNegocio');
  Route.post('obtenerEventosFecha', 'NegocioController.obtenerEventosFecha');
  Route.post('registrarEvento', 'NegocioController.registrarEventoNegocio');
  Route.post('eliminarEvento', 'NegocioController.eliminarEvento');
  Route.post('editarEvento', 'NegocioController.editarEvento');
  Route.post('obtenerEvento', 'NegocioController.obtenerEventoById');

  // Reservaciones negocio
  Route.post('obtenerReservaciones', 'NegocioController.obtenerReservaciones');
  Route.post('updateReservacion', 'NegocioController.updateReservacion');
  Route.post('cancelarReservacion', 'NegocioController.cancelarReservacion');
  Route.post('buscarReservacion', 'ConsultaController.buscarReservacion');

  // consultas
  Route.get('top', 'ConsultaController.top');
  Route.get('test', 'ConsultaController.test');
  Route.get('top', 'ConsultaController.top');
  Route.get('cat', 'ConsultaController.cat');
  Route.post('comentariosranked', 'NegocioController.comentariosranked');
  Route.post('comentarios', 'NegocioController.comentarios');
  Route.post('historia', 'NegocioController.historia');
  Route.get('top5', 'ConsultaController.getTop5')
  Route.get('getTop5ByCategoria', 'ConsultaController.getTop5ByCategoria')
  Route.post('createComentario', 'ConsultaController.createComentario')
  Route.post('buscador', 'ConsultaController.getBusqueda')
  Route.get('Bares', 'ConsultaController.getBares')
  Route.get('Antros', 'ConsultaController.getAntros')
  Route.get('Cantinas', 'ConsultaController.getCantinas')
  Route.get('Billares', 'ConsultaController.getBillar')
  Route.get('Clubs', 'ConsultaController.getClubs')
  Route.post('favs', 'ConsultaController.getFavs')
  Route.get('all', 'ConsultaController.getAll')
}).prefix('api/negocio/').middleware('checktoken')


