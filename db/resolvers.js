// Resolvers 

const resolvers = {
    Query: {
        obtenerCursos: (_, { input }, ctx, info) => {
            "Algo"
        }
    },
    Mutation: {
        nuevoUsuario: () => 'Creando nuevo usuario'
    }
}


// gragphql itera de forma automatica los cursos 



module.exports = resolvers;