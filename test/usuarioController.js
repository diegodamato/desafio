let md5 = require('md5');
let guid = require('guid');
let moment = require('moment');
let jwt = require('jsonwebtoken');
let request = require('supertest');
let connection = require('mongodb').connect;
let app = require('../app/bootstrap/express-bootstrap')();
let config = require('../app/bootstrap/config-bootstrap')();
let statusMensagens = require('../app/util/statusMensagens');

let validadorAmbiente = require('../app/util/validadorAmbiente')();
let DatabaseCleaner = require('database-cleaner');

let g1 = guid.create();
let g2 = guid.create();
let usuario1 = {};
let usuario2 = {};
let senhaUsuario1 = "teste1";
let senhaUsuario2 = "teste2";

usuario1.nome = "Teste1";
usuario1.email = "teste1@gmail.com"; 
usuario1.senha = md5(senhaUsuario1);
usuario1.ultimo_login = new Date(moment().subtract(1, 'day'));
usuario1.data_atualizacao = new Date();
usuario1.data_criacao = new Date();
usuario1.telefones = [
                        { 
                            numero: "123456789", 
                            ddd: "21" 
                        },
                        { 
                            numero: "987654321", 
                            ddd: "21" 
                        }
                    ];
usuario1.id = g1.value;
usuario1.token = md5(jwt.sign(usuario1, "secreto"));

usuario2.nome = "Teste2";
usuario2.email = "teste2@gmail.com"; 
usuario2.senha = md5(senhaUsuario2);
usuario2.ultimo_login = new Date();
usuario2.data_atualizacao = new Date();
usuario2.data_criacao = new Date();
usuario2.telefones = [
                        { 
                            numero: "123456789", 
                            ddd: "21" 
                        },
                        { 
                            numero: "987654321", 
                            ddd: "21" 
                        }
                    ];
usuario2.id = g2.value;
usuario2.token = md5(jwt.sign(usuario2, "secreto"));


describe('Testando usuarioController', () => {

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
                            usuario1,
                            usuario2
                        ],
                    () => done());
                });
            });
        });
    });
   
    it('#Verificando consulta de usuario com sucesso',done => {
        
        let dados = { 
                        "email": usuario2.email, 
                        "senha": senhaUsuario2
                    }
        
        request(app)
                .get(`/v1/usuario/${usuario2.id}`)
                .set('Authorization', `Bearer ${usuario2.token}`)
                .timeout(30000)
                .expect(200)
                .expect('Content-Type',/json/)
                .end(done);
    }); 

    it('#Verificando consulta de usuario sem token no header',done => {
        
        let dados = { 
                        "email": usuario2.email, 
                        "senha": senhaUsuario2
                    }
        
        request(app)
                .get(`/v1/usuario/${usuario2.id}`)
                .timeout(30000)
                .expect(401, {"mensagem": statusMensagens.NAO_AUTORIZADO})
                .expect('Content-Type',/json/)
                .end(done);
    });


    it('#Verificando consulta de usuario com token invalido',done => {
        
        let dados = { 
                        "email": usuario2.email, 
                        "senha": senhaUsuario2
                    }
        
        request(app)
                .get(`/v1/usuario/${usuario2.id}`)
                .set('Authorization', `Bearer ${usuario1.token}`)
                .timeout(30000)
                .expect(401, {"mensagem": statusMensagens.NAO_AUTORIZADO})
                .expect('Content-Type',/json/)
                .end(done);
    });


    it('#Verificando consulta de usuario com sessao expirada',done => {
        
        let dados = { 
                        "email": usuario1.email, 
                        "senha": senhaUsuario1
                    }
        
        request(app)
                .get(`/v1/usuario/${usuario1.id}`)
                .set('Authorization', `Bearer ${usuario1.token}`)
                .timeout(30000)
                .expect(401, {"mensagem": statusMensagens.SESSAO_INVALIDA})
                .expect('Content-Type',/json/)
                .end(done);
    });


    it('#Verificando cadastro de usuario com email ja existente',done => {
       
        request(app)
                .post(`/v1/usuario`)
                .send(usuario1)
                .timeout(30000)
                .expect(403, {"mensagem": statusMensagens.EMAIL_EXISTENTE})
                .expect('Content-Type',/json/)
                .end(done);
    });


    it('#Verificando cadastro de usuario com email ja existente',done => {
        
        let g = guid.create();
        let usuario = {};

        usuario.nome = "Teste";
        usuario.email = "teste@gmail.com"; 
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


        request(app)
                .post(`/v1/usuario`)
                .send(usuario)
                .timeout(30000)
                .expect(200)
                .expect('Content-Type',/json/)
                .end(done);
    
    });
}); 

