'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
const Database = use("Database");
class SesionController {

    async sesion({ request, auth, response }) {
        const { username, password } = request.all();


        const validation = await validate(request.all(), {
            username: "required",
            password: "required",
        });

        if (validation.fails()) {
            return response.status(400).send({ message: validation.messages() });
        }

        const userFound = await User.findBy("username", username);
        if (!userFound) {
            return response.status(400).send({ message: "No existe este usuario" });
        }


        const isSame = Hash.verify(password, userFound.password);
        if (!isSame) {
            return response.status(400).send("Contraseña incorrecta");
        }

        try {
            const token = await auth.attempt(username, password);
            const users = await User.all();
            return response.status(200).send({ 'message': "ok", data: { token, username, users } });
        } catch (error) {
            return response.status(400).send({ status: 'error', 'message': error });
        }
    }

    async registrar({ request, response }) {
        const { user, password } = request.all();
        console.log(user, password);
        const validation = await validate(request.all(), {
            username: 'required',
            email: 'required|email',
            nombre: 'required',
            apellidoP: 'required',
            apellidoM: 'required',
            foto: 'required',
            fecha_nacimiento: 'required',
            password: 'required|min:5',
        });

        if (validation.fails()) {
            return response.status(400).send({ message: validation.messages() })
        }

        const userFound = await User.findBy("email", email);
        if (userFound) {
            return response.send({
                status: 'error', message: 'Ya existe un usuario creado con ese correo.'
            });
        }

        const userBD = await User.create({
            username,
            email,
            nombre,
            apellidoP,
            apellidoM,
            foto,
            fecha_nacimiento,
            password,
        });

        return this.login(...arguments);

        //return response.status(200).send({message:'Has creado tu usuario con exito.'})
    }

}

module.exports = SesionController
