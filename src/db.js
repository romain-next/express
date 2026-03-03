const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelizeInstance = process.env.NODE_ENV === 'test' 
  ? new Sequelize('sqlite::memory:')
  :  new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
  {
    host:  process.env.DB_HOST,
    dialect:  process.env.DB_DIALECT,
    port:  process.env.DB_PORT,
  },
);

async function connectDB() {
  try {
    await sequelizeInstance.authenticate();
    console.log('✅ Connexion DB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion DB:', error);
    process.exit(1);
  }
}

module.exports = {sequelizeInstance, connectDB}