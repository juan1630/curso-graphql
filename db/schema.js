const { gql } = require('apollo-server')


// Scehmas 
const typeDefs = gql `

    type Usuaurio  {
        id:ID
        name: String
        lastName: String
        email: String
        date: String
    }

    type Producto {
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
    }

    type Token {
        token: String
    }

    type Cliente {
        id:ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor:ID
    }


    input UsuarioInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    input AutenticarInput {
        email:String!
        password:String!
    }
    
    input ProductoInput {
        nombre: String!
        existencia: Int!
        precio: Float!
    }

    input ClienteInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono:String

    }

    type Query {

        #Usuarios
        obtenerUsuario(token: String! ): Usuaurio

        #Productos 
        obtenerProducots:[Producto]
        obtenerProducto( id: ID! ) : Producto

        #Clientes
        obtenerClientes: [Cliente]
        obtenerClientesVendedor:[Cliente]
    }


    type Mutation {
        # usuarios
        nuevoUsuario(input: UsuarioInput ): Usuaurio
        autenticarUsuario(input: AutenticarInput ): Token
        
        #productos
        nuevoProducto(input: ProductoInput ): Producto
        actualizarProdcuto( id: ID!, input: ProductoInput ):Producto
        eliminarProducto ( id: ID! ): String

        #clientes
        nuevoCliente( input: ClienteInput ): Cliente
    }
`;

// los input son valores que se le pasan por medio de las varibales y que se hace referencia en el schema y los resolvers
// ademas de que pueden ser obligatorios usando el ----- !


// los mutations son como el post
module.exports = typeDefs;