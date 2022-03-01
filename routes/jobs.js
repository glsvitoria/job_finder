const express = require('express')
const router  = express.Router()
const Job     = require('../models/Job')

// TEST ROUTE
router.get('/test', (req, res) => {
    res.send("Deu certo")
}) // Testando se as rotas com o app.js estão funcionando

// JOB DETAILS -> view/1, view/2
router.get('/view/:id', (req, res) => Job.findOne({
    where: {id: req.params.id} // Acha o id da vaga
}).then(job => {
    res.render('view', {
        job // Retorna o job
    })
}).catch(err => console.log(err)))

// ROUTER FOR PAGE ADD JOB
router.get('/add', (req, res) => {
    res.render('add')
})

// ADD JOB WITH POST
router.post('/add', (req, res) => {
    let {title, salary, company, description, email, new_job} = req.body // Trazendo as variáveis do banco de dados

    // INSERT DATA
    Job.create({
        title,
        description,
        salary,
        company,
        email,
        new_job
    }) // Criando elas no programa para fazer uso
    .then(() => res.redirect('/')) // Redireciona para home após adicionar uma vaga
    .catch(err => console.log(err))
})

module.exports = router