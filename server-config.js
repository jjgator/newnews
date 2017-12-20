const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const serve = require('koa-static');
const send = require('koa-send')

const dbFetch = require('./requestHandlers/dbFetch');
const articleHandler = require('./requestHandlers/article-handler.js');
const keyHandler = require('./requestHandlers/key-handler.js');

const app = new Koa();
const router = new Router();

app.use( bodyParser() );
app.use( serve(__dirname + '/client') );

router
  .get('/articles', articleHandler.retrieveArticles)
  .get('/oldnews', articleHandler.dumpOldNews)
  .get('/articles/:key', articleHandler.retrieveGlobalByKey)
  // .get('/articles/:key', articleHandler.retrieveByKey)
  .get('/articles/concept/:concept', articleHandler.retrieveByConcept)
  .get('/headlines', articleHandler.retrieveHeadlines)
  .get('/keys', keyHandler.retrieveKeys)
  .get('/concepts', async (ctx, next) => {
    await dbFetch.getConceptsByContinent()
      .then(function(response) {
        ctx.body = {
          'concepts' : response,
        }
      })
  })
  .get('/hosts', articleHandler.findHost)

app.use( router.routes() );
// app.use( router.allowedMethods());

app.use(function* index() {
  yield send(this, '/client/index.html');
});

module.exports = app;
