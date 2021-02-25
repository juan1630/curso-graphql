// colections

const Usuario = require('../models/Usuarios');
const Producto = require('../models/producto');
const Cliente = require('../models/cliente');

// importamos los modulos
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

        },


        obtenerClientes: async() => {
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error)
            }
        },

        obtenerClientesVendedor: async(_, {}, ctx) => {


            try {

                const clientes = await Cliente.find({ vendedor: ctx.usuario.id });
                return clientes;

            } catch (error) {
                console.log(error);

            }
        },

        obtenerCliente: async(_, { id }, ctx) => {
            try {

                const cliente = await Cliente.findById(id);

                if (!cliente) {
                    throw new Error('El cliente no existe');
                }

                if (cliente.vendedor.toString() !== ctx.usuario.id) {
                    throw new Error('No tienes las credenciales');
                }
                return cliente;
            } catch (error) {

                console.log(error);
                throw new Error('Algo pasó', error);
            }
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

        // update actualizar el producto
        actualizarProdcuto: async(_, { id, input }, ) => {
            // revisamos el producto existe 
            let producto = await Producto.findById(id);

            if (!producto) {
                throw new Error('El producto no existe');
            }
            // guardarlo en la DB
            // con esta propiedad se devuelven los valores actualizados
            producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });
            return producto;
        },

        // eliminar un producto 
        eliminarProducto: async(_, { id }) => {

            const producto = await Producto.findById(id);

            if (!producto) {
                throw new Error('El producto no existe');
            }

            await Producto.findOneAndDelete(id);

            return 'Se elimino el producto';


        },


        // clientes 
        nuevoCliente: async(_, { input }, ctx) => {

            const { email } = input;


            // console.log(ctx);

            // verificar que el cliente no este registrado

            const cliente = Cliente.findOne(email);

            if (!cliente) {
                throw new Error('Ya existe el cliente');

            }

            const nuevoCliente = new Cliente(input);

            nuevoCliente.vendedor = ctx.usuario.id;

            try {

                // asignar vendedor


                // guardar en la DB 
                const resultado = await nuevoCliente.save();

                return resultado;

            } catch (error) {

                console.log(error);
                throw new Error(error);

            }

        },
        actualizarCliente: async(_, { id, input }, ctx) => {

            // verificar si existe el cliente

            const cliente = await Cliente.findById(id);

            if (!cliente) {
                throw new Error('No encontró el Cliente');
            }

            // verificar si el usuario que lo edita lo creo
            if (ctx.usuario.id !== cliente.vendedor.toString()) {

                throw new Error('No puedes modificar este cliente');
            }

            // modificar al cliente

            try {

                const clienteEditado = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
                return clienteEditado;

            } catch (error) {
                throw new Error('No se pudo modificar el cliente');
            }
        },
        eliminarCliente: async(_, { id }, ctx) => {

            // verificar que existe el cleinte

            const cliente = await Cliente.findById(id);

            if (!cliente) {
                throw new Error('Él cliente no existe');
            }

            // que lo pueda eliminar el vendedor 

            if (cliente.vendedor !== ctx.usuario.id) {
                throw new Error('No puedes eliminar a este cliente');
            }

            // eliminar el cliente
            Cliente.findOneAndDelete({ _id: id });
            return 'Se eliminó el cliente';
        }

    },
}


// gragphql itera de forma automatica los cursos 



module.exports = resolvers;