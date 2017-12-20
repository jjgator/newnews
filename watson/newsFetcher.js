const Axios = require('axios');
const Schedule = require('node-schedule');
const mongoose = require('mongoose')
const dbconnection = require('../mongodb_config')
mongoose.Promise = global.Promise;

const Article = require('../models/Article.js');
const Key = require('../models/Key.js');
const {url, username, password, version} = require('../config/config.js');
const Continents = require('./Continents.js');
const articleHandler = require('../requestHandlers/article-handler.js');

/*// node-schedule time format
'second, minute, hour, dayOfMonth, month, dayOfWeek'*/
const fetchTime = '0 0 5 * * *'; //every day at 6am
const everyTwoSec = '*/2 * * * * *'

const date = new Date();
const today = date.toJSON().split('T')[0];
date.setDate(date.getDate()-1);
const yesterday = date.toJSON().split('T')[0];
console.log(`today's date is: ${today}`);
console.log(`yesterday's date is: ${yesterday}`);

articleHandler.dumpOldNews();
articleHandler.dumpOldKeys();

for(let continentName in Continents){

  var countryList = Continents[continentName];

  Axios.get(url, {
    auth: {
      username: username,
      password: password
    },

    params: {
      aggregation: `filter(crawl_date>${yesterday})`
        + `.filter(country::[${countryList.join('|')}])`
        + `.term(enriched_title.concepts.text,count:20).top_hits(20)`,
      count: 0,
      version: version
    }

  }).catch( (error) => {
    console.log('AXIOS REQUEST FAIL: ',error);

  }).then ( ({data}) => {
    // const data = require('./top20_unfiltered.js');
    return Promise.all( data.aggregations[0].aggregations[0].aggregations[0].results.map( ({key, matching_results, aggregations}) => {

      return Promise.all( aggregations[0].hits.hits.map( ({id, score, title, country, crawl_date, url, host, text, main_image_url, enriched_text}) => {

        let concepts = enriched_text.concepts.filter( ({relevance}) => {
          return relevance >= 0.7;
        }).reduce( (accum, concept) => {
          accum[concept.text.toLowerCase()] = concept.relevance;
          return accum;
        }, {}) || {};

        return Article.findOneOrCreate({id:id}, {
          id: id,
          key: key.toLowerCase(),
          score: score,
          title: title,
          country: country,
          crawl_date: crawl_date,
          url: url,
          host: host,
          text: text,
          main_image_url: main_image_url,
          sentiment_score: enriched_text.sentiment.document.score,
          concepts: concepts,
          category: enriched_text.categories[0]? enriched_text.categories[0].label : enriched_text.categories[0]
        })

      }) ).then ( (articles) => { //end of second promise all
        return articles.filter( ({_id}) => {
          return _id !== undefined;
        }).map( ({_id}) => _id );

      })
      .then((arrayOfIDs) => {
        var aggregateByKey = {
          continent: continentName,
          key: key.toLowerCase(),
          matching_results: matching_results,
          query_date: today,
          article_ids: arrayOfIDs
        }

        // console.log('Aggregation by Key: ', aggregateByKey)

        var query = {
          continent: continentName,
          key: key.toLowerCase(),
          query_date: today
        }

        // console.log('match statement : ', query)
        return Key.findOneOrCreate(query, aggregateByKey);
      })
      .catch(err => {
        console.log('catching error: ' , err)
      })

    }) ) //end of first promise all

  }).then( (Keys) => {
    console.log(`SUCCESS: ${Keys.length} keys saved`)

  }).catch( (error) => {
    console.log(error)
  });

}

// keys, continent, headlines,

// saving file
// fs.open(`./${continentName}_top20_filtered.js`,'w', (err, result) => {
//   if(!err){
//     fs.writeFile(`./${continentName}_top20_filtered.js`, JSON.stringify({results:staged_articles},null,2), (err) => {
//       err?  console.log(err) : console.log(`SUCCESS: ${staged_articles.length} articles written to ${continentName}_top20_filtered.js`);
//     })
//   } else {
//     console.log('FILE OPEN FAIL',err);
//   }
// })

// const cronRule = new Schedule.RecurrenceRule();
// cronRule.hour = 5;

// const job = Schedule.scheduleJob(everyTwoSec, ()=>{
//   console.log('two seconds have passed!')
//   console.log(`yesterday's date is: ${yesterday}`)
//   console.log(requestURL);
//   // Axios.get(url).then( (resolve) => {
//   //
//   // }).catch( (err) => {
//   //
//   // })
//   console.log(typeof new Date())
// })
