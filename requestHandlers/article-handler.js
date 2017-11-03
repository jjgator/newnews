const Article = require('../models/Article.js');
const Key = require('../models/Key.js');

let date = new Date();
date.setDate(date.getDate()-1);
const yesterday = date.toJSON().split('T')[0];

exports.retrieveArticles = async (ctx, next) => {
  await Article.find({crawl_date: {$gt:yesterday}}).then( articles => {
    ctx.body = articles;
  }).catch( (error) => {
    console.log('article-handler.retrieveArticles fail: ', error);
  })
}

exports.retrieveGlobalByKey = async (ctx, next) => {
  await Article.find(
    { key: ctx.params.key.toLowerCase(),
      crawl_date: {$gt:yesterday} }).then( (articles) =>{
    ctx.body = articles;
  }).catch( error => {
    console.log(error)
  })
}

exports.retrieveByConcept = async( ctx, next ) => {
  await Article.find({}).where(`concepts.${ctx.params.concept}`).ne(undefined)
    .where('crawl_date').gt(yesterday).then( (articles) => {
      ctx.body = articles;
  })
}

exports.retrieveHeadlines = async( ctx, next ) => {
  await Article.find({crawl_date: {$gt:yesterday}}, 'title url').then((columns) => {
    ctx.body = {'headlines': columns};
  }).catch( (error) => {
    console.log('article-handler.js retrieveHeadlines error: ',error);
  })
}

exports.findHost = async( ctx, next ) => {
  await Article.find({crawl_date: {$gt:yesterday}}).then((articles) => {
    ctx.body = articles.filter((article) => {
      if(article.url.includes('jazeera')){
        console.log(article.host)
      }
      return article.url.includes('jazeera');
    })
  })
}
