const mongoose = require ('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect (process.env.MONGO_URI)
        console.log ('Database connected successfully')        
    } catch (err) {
        console.error('database connection failed')
        process.exit (1)        
    }
};



module.exports = dbConnection;