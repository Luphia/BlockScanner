const path = require('path');

const pem = require('pem');
const spdy  = require('spdy');
const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const dvalue = require('dvalue');

const Bot = require(path.resolve(__dirname, 'Bot.js'));
const Utils = require(path.resolve(__dirname, 'Utils.js'));

class Receptor extends Bot {
  constructor() {
  	super();
    this.router = new Router();
  }

  start() {
    this.createPem()
    .then((options) => {
      const app = new koa();
      
      const handleRequest = async (ctx, next) => {
        ctx.body = 'Hello World';
        await next();
      };
      app.use(bodyParser())
         .use(this.router.routes())
         .use(this.router.allowedMethods());
      const server = spdy.createServer(options, app.callback()).listen(8080);

      this.register({ pathname: '/', options: { method: 'get' }, operation: (inputs) => { return Promise.resolve(this.config.packageInfo); } })
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

  register({ pathname, options, operation }) {
  	const method = options.method.toLowerCase();
    this.router[method](pathname, (ctx, next) => {
      const inputs = {
        body: ctx.request.body,
        params: ctx.params,
        header: ctx.header,
        method: ctx.method,
        query: ctx.query
      };
      return operation(inputs)
      .then((rs) => {
      	ctx.body = rs;
      	next();
      });
    });
  }
}

module.exports = Receptor;