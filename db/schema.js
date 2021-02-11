const { gql } = require('apollo-server')

// Scehmas 
const typeDefs = gql `
    type Curso {
       titulo: String
    }

    input CursoInput {
        tecnologia: String
    }

    type Query {
        obtenerCursos(input: CursoInput! ) : [Curso]
       
    }
`

// los input son valores que se le pasan por medio de las varibales y que se hace referencia en el schema y los resolvers
// ademas de que pueden ser obligatorios usando el ----- !


module.exports = typeDefs;