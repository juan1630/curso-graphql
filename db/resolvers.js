// importamos los modulos

const Usuario = require('../models/Usuarios');
const Producto = require('../models/producto');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });


// Creamos el Token del usuario

const crearToken = (usuario, salt, expirece) => {

    const { id, name, lastName, email } = usuario;

    return jwt.sign({ id }, salt, { expiresIn: expirece });
}


// Resolvers 

const resolvers = {
    Query: {
        obtenerUsuario: async(_, { token }) => {
            const usuarioId = await jwt.verify(token, process.env.salt);
            return usuarioId;
        },
        //Productos
        obtenerProducots: async() => {
            try {

                const productos = await Producto.find({});
                return productos;

            } catch (error) {

                console.log(error);
                throw new Error('Algo pasó');
            }
        },
        // Productos

        obtenerProducto: async(_, { id }) => {
            // revisar el producto existe 
            const producto = await Producto.findById(id);

            if (!producto) {

                throw new Error('Producto no encontrado')
            }

            return producto;

        }

    },

    Mutation: {


        nuevoUsuario: async(_, { input }) => {

            const { email, password } = input;

            // revisar si el usuario esta registrado

            const usuarioExiste = await Usuario.findOne({ email })
            if (usuarioExiste) {
                throw new Error('Él usario ya existe en la DB');
            }

            // cifrar el password

            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            // guardar en la DB

            try {
                const usuario = new Usuario(input)
                usuario.save();
                return usuario;

            } catch (error) {
                console.log(error);
                throw new Error('Algo pasó con la DB');
            }
        },
        // termina el post del usuario

        // incia la autenticacion del usuario

        autenticarUsuario: async(_, { input }) => {

            // ver si el usuario existe 
            const { email, password } = input;
            const existeUsuario = await Usuario.findOne({ email });

            if (!existeUsuario) {
                throw new Error('Él usuario no existe');
            }

            // reviasr el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error('El password es incorrecto');
            }
            // retornar el token
            return {
                token: crearToken(existeUsuario, process.env.salt, '24h')
            }

        },
        // termina el mutation de autenticar

        nuevoProducto: async(_, { input }) => {
            console.log(input);
            try {
                const producto = new Producto(input);
                // grabar en la DB
                const resultado = await producto.save();
                return resultado;

            } catch (error) {
                console.log(error);
                throw new Error('Se produjo un error', error);
            }
        },


    },
}


// gragphql itera de forma automatica los cursos 



module.exports = resolvers;