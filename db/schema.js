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
    type Token {
        token: String
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
    
    type Query {
        obtenerUsuario(token: String! ): Usuaurio
    }


    type Mutation {

        nuevoUsuario(input: UsuarioInput ): Usuaurio
        autenticarUsuario(input: AutenticarInput ): Token
    }
`;

// los input son valores que se le pasan por medio de las varibales y que se hace referencia en el schema y los resolvers
// ademas de que pueden ser obligatorios usando el ----- !


// los mutations son como el post
module.exports = typeDefs;