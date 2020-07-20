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
  Route.get('obtenerNegocio', 'NegocioController.obtenerNegocio');
}).prefix('api/negocio/')
