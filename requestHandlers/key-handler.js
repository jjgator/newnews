const Key = require('../models/Key.js');
const Article = require('../models/Article.js');
const Continents = require('../watson/Continents.js');
const Blacklist = require('../watson/blacklist.js')

let date = new Date();
date.setDate(date.getDate()-1);
const yesterday = date.toJSON().split('T')[0];

exports.retrieveKeys = async (ctx, next) => {
  console.log(yesterday)
  var keys = [];
  var topArticles = [];
  await Key.find({
    // query_date: {$gt:yesterday}
  }).then( (keyConcepts) => {
    keys = keyConcepts.filter( ({key}) => { return !Blacklist.globalBlacklist.includes(key) });
    return keys;
  }).then( (filteredKeys) => {
    for(let continentName in Continents){
      topArticles = topArticles.concat( filteredKeys.filter( (filteredKey) => {
        return filteredKey.continent === continentName;
      }).slice(0,3).map( ({article_ids}) => {
        return Article.findOne({_id:article_ids[0]});
      }) );
    }
    return Promise.all(topArticles);
  }).then( (articles) => {
    console.log(articles.length)
    ctx.body = {
      keys: keys,
      topArticles: articles
    }
  })
}
