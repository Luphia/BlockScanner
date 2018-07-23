const path = require('path');

const pem = require('pem');
const http2 = require('http2');
const koa = require('koa');
const dvalue = require('dvalue');

const Bot = require(path.resolve(__dirname, 'Bot.js'));
const Utils = require(path.resolve(__dirname, 'Utils.js'));

class Receptor extends Bot {
  start() {
    this.createPem()
    .then((options) => {
      const app = new koa();
      
      const handleRequest = function*(next) {
        this.body = 'Hello World';
        yield next;
        console.log('done');
      };
      app.use(handleRequest);
      const server = http2.createSecureServer(options, app.callback()).listen(8080);
    });
  }

  createPem() {
    return new Promise((resolve, reject) => {
      pem.createCertificate({days: 365, selfSigned: true}, (e, d) => {
        if(e) {
      	  reject(e);
        } else {
          const pem = {
            cert: d.certificate,
            key: d.serviceKey
          };
          resolve(pem);
        }
      });
    });
  }
}

module.exports = Receptor;