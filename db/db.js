const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

const conectToDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: false
        });

        console.log('DB connected!!')
        return true;

    } catch (error) {
        console.log('Hubo un error!');
        console.log(error);
        process.exit(1);
    }
}


module.exports = conectToDB;