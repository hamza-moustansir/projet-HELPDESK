const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect('mongodb://localhost:27017/youruri', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch(err => console.error('Erreur de connexion à la base de données :', err));
}


module.exports = connectDB
