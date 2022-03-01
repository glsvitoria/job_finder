const express    = require('express') // Import do express
const app        = express() // Configurando a constante para rodar o express
const exphbs     = require('express-handlebars')
const path       = require('path')
const db         = require('./db/connection') // Linkando o banco de dados
const bodyParser = require('body-parser')
const Job        = require('./models/Job')
const Sequelize  = require('sequelize')
const Op         = Sequelize.Op

const PORT = processes.env.PORT || 3000 // Porta utilizada

app.listen(PORT, function(){
    console.log("O Express está rodando na porta " + PORT)
}) // Verificando se o servidor está rodando na porta definida

// BODY PARSER
app.use(bodyParser.urlencoded({extended: false})) // Fazendo uso do body parser para que possa ser utilizado o req.body no jobs.js

// HANDLE BARS
app.set('view engine', 'handlebars') // Definindo o uso do handlebars
const hbs = exphbs.create({defaultLayout: 'main'}) // Resolvendo o erro do exphbs is not a function
app.engine('handlebars', hbs.engine) // Definindo o layout principal
app.set('views', path.join(__dirname, 'views')) // Definindo o diretório das views

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

// DB CONNECTION
db
  .authenticate() // Fazendo a conexão com o banco de dados
  .then(() => {
      console.log("Conectou ao banco de dados")
  })
  .catch(err => {
      console.log("Ocorreu um erro ao conectar")
  })

// ROUTES
app.get('/', (req, res) => {

    let search = req.query.job
    let query = '%'+search+'%' // PH -> PHP , Word -> Wordpress, press -> Wordpress, possibilitado pelo Op.like

    if(!search){ // Caso não ocorra busca acontece tudo normal
        Job.findAll({order: [ // Puxando todos os dados do sistema
            ['createdAt', 'DESC'] // Ordenação decrescente de criação
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            })
        })
        .catch(err => console.log(err))
    } else {
        Job.findAll({ // Caso ocorra busca
            where:{title: {[Op.like]: query}}, // Buscará com um título parecido do que está sendo buscado
            order: [ // Puxando todos os dados do sistema
            ['createdAt', 'DESC'] // Ordenação decrescente de criação
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            })
        })
        .catch(err => console.log(err))
    }


    
    
}) // Verificando se o servidor está funcionando em todas as rotas

// JOBS ROUTES
app.use('/jobs', require('./routes/jobs'))