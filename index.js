const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer();

//Plugins padrão para receber os dados de uma requicisão
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//defindo a porta que o servidor ira ouvir
server.listen(7000, function() {
    console.log('ouvindo na porta 7k');
});


const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'rhteste'
    }
});


//Rota para a Página principal
server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
}))

//ROTA PARA CADASTRAR DADOS *--------------------------------------------------------------------------------------------------------------------------*
server.post('/cadastra', function(req, res) {
    knex('projeto')
        .insert(req.body)
        .then((dados) => {
            res.send(dados)
        })
})

//ROTA PARA BUSCAR TODOS OS DADOS *--------------------------------------------------------------------------------------------------------------------------*
server.get('/busca', function(req, res, next) { //next é para fazer tratamento de erros
    knex('projeto').then((dados) => { //fazendo uma chamada com modulo knex
        res.send(dados);
    }, next);
});

//ROTA PARA BUSCA C/ FILTRO (por matricula) *--------------------------------------------------------------------------------------------------------------------------*
server.get('/busca/:id', function(req, res, next) {
    const { id } = req.params //expecificando que ID é um parametro do banco para fazer as operações
    knex('projeto')
        .where('id', id)
        .first() //retornar apenas o primiero encontrado
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('Nada foi encontrado')) //mostrar erro se o ID não existir 
            res.send(dados)
        }, next)
});

//ROTA PARA ATUALIZAR OS DADOS  *--------------------------------------------------------------------------------------------------------------------------*
server.put('/atualiza/:id', function(req, res, next) {
    const { id } = req.params
    knex('projeto')
        .where('id', id)
        .update(req.body) //fazer a ATUALIZAÇÃO de um dado
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('Nada foi encontrado')) //mostrar erro se o ID não existir 
            res.send('Dados atualizados')
        }, next)
});

//ROTA PARA DELETAR DADOS *--------------------------------------------------------------------------------------------------------------------------*
server.del('/deleta/:id', function(req, res, next) {
    const { id } = req.params
    knex('projeto')
        .where('id', id)
        .delete() //delete sem parametro pois ja foi definido na const
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('Nada foi encontrado')) //mostrar erro se o ID não existir 
            res.send('Dados excluidos !')
        }, next)
});