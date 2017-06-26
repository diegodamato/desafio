let md5 = require('md5');
let guid = require('guid');
let jwt = require('jsonwebtoken');
let request = require('supertest');
let connection = require('mongodb').connect;
let app = require('../app/bootstrap/express-bootstrap')();
let config = require('../app/bootstrap/config-bootstrap')();
let statusMensagens = require('../app/util/statusMensagens');

let validadorAmbiente = require('../app/util/validadorAmbiente')();
let DatabaseCleaner = require('database-cleaner');
let token = '';

let g = guid.create();
let usuario = {};

usuario.nome = "Diego";
usuario.email = "diego@gmail.com"; 
usuario.senha = md5("teste");
usuario.ultimo_login = new Date();
usuario.data_atualizacao = new Date();
usuario.data_criacao = new Date();
usuario.telefones = [
                        { 
                            numero: "123456789", 
                            ddd: "21" 
                        },
                        { 
                            numero: "987654321", 
                            ddd: "21" 
                        }
                    ];
usuario.id = g.value;
usuario.token = md5(jwt.sign(usuario, "secreto"));


describe('Testando signinController', () => {

    before(done => {
        let validador = new validadorAmbiente();
        validador.validar();
        done();
    });

   beforeEach((done) => {
     connection(config.mongodb.url,
        (erro,db) => {
            let databaseCleaner = new DatabaseCleaner('mongodb');

            databaseCleaner.clean(db,() => {
                
                db.createCollection('Usuario',null,(usuarioErro, usuarioCollection) => {
                    usuarioCollection.insert(
                        [
                            usuario
                        ],
                    () => done());
                });
            });
        });
    });
   
    it('#Verificando signin com sucesso',done => {
        
        let dados = { 
                        "email": usuario.email, 
                        "senha": "teste"
                    }
        
        request(app)
                .post('/v1/signin')
                .send(dados)
                .timeout(30000)
                .expect(200)
                .expect('Content-Type',/json/)
                .end(done); 
    }); 
    
    it('#Verificando signin com erro de email inexistente',done => {
        
        let dados = { 
                        "email": "teste@gmail.com", 
                        "senha": "teste"
                    }
        
        request(app)
                .post('/v1/signin')
                .send(dados)
                .timeout(30000)
                .expect(403, {"mensagem": statusMensagens.EMAIL_NAO_EXISTE})
                .expect('Content-Type',/json/)
                .end(done); 
    });

    it('#Verificando signin com erro de senha invalida',done => {
        
        let dados = { 
                        "email": usuario.email, 
                        "senha": "testes"
                    }
        
        request(app)
                .post('/v1/signin')
                .send(dados)
                .timeout(30000)
                .expect(401, {"mensagem": statusMensagens.SENHA_INVALIDA})
                .expect('Content-Type',/json/)
                .end(done); 
    }); 

});