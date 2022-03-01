const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: 'sqlite', // Banco de dados usado
    storage: './db/app.db' // Local do banco de dados
})

module.exports = sequelize