const { gql } = require('apollo-server')

// Scehmas 
const typeDefs = gql `
    type Curso {
       titulo: String
    }
    type Tecnologia {
        
        tecnologia: String 
    }
    type Query {
        obtenerCursos : [Curso]
        obtenerTacnologia:[Tecnologia] 
    }
`


module.exports = typeDefs;