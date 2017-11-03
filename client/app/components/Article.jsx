import React from 'react';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import Chip from 'material-ui/Chip';
import {selectTag} from '../actions';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  RedditShareButton,
  EmailShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const RedditIcon = generateShareIcon('reddit');
const EmailIcon = generateShareIcon('email');

const styles = {
  card: {
    width: '350px',
    height: '300px',
    display: 'flex',
    borderRadius: '0px',
    boxShadow: 'none',
    padngBottom: '10px',
    icon: {
      margin: '10px',
      width: '52px'
    },
    title: {
      fontWeight: 'bold',
      fontSize: '14px',
      maxWidth: '320px'
    },
    avatar: {
      width: '52px',
      height: '52px'
    },
    text: {
      paddingTop: '0px',
      paddingBottom: '2px',
    },
    chip: {
      marginRight: 4,
      display: 'inline-block',
      lineHeight: '25px'
    },
    labelStyle: {
      fontSize: '12px'
    }
  },
  featured: {
    boxShadow: 'none',
    width: '700px',
    height: '300px',
    display: 'flex',
    borderRadius: '0px',
    padding: '5px',
    avatar: {
      width: '120px',
      height: '120px',
    },
    title: {
      fontWeight: 'bold',
      fontSize: '22px',
      maxWidth: '600px'
    },
    subtitle: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
  }
};

const sortConcepts = obj => {
  let conceptArray = [];
  for (let key in obj) {
    conceptArray.push({text: key, relevance: obj[key]});
  }
  return conceptArray.sort((a, b) => {
    return b.relevance - a.relevance;
  });
};

const Article = ({ article, handleTouchTap, concepts }) => (
  concepts = sortConcepts(concepts),
  console.log(article.featured),
  <Card style={article.featured ? styles.featured : styles.card}>
    <CardHeader
      avatar={article.main_image_url ? 
        <img 
          src={article.main_image_url} 
          style={article.featured ? styles.featured.avatar : styles.card.avatar}>
        </img> 
          : <i className={article.featured ? "fa fa-newspaper-o fa-5x" : "fa fa-newspaper-o fa-3x"} aria-hidden="true"></i>}
      title={article.title.length > 70 ? article.title.slice(0, 60).concat('...') : article.title}
      titleStyle={article.featured ? styles.featured.title : styles.card.title}
      subtitle={article.host}
      subtitleStyle={article.featured? styles.featured.subtitle : null}
      actAsExpander={false}
    />
    <CardText expandable={false} style={styles.card.text} >
      {article.featured ? article.text.slice(0,400) + '...' : article.text.slice(0,200) + '...' } <a target="_blank" href={article.url}>See More</a>
      <div className="chips">{
        concepts.map((concept, i) => {
          if (i < 3) {
            return <Chip 
              key={i} 
              style={styles.card.chip} 
              labelStyle={styles.card.labelStyle} 
              onClick={() => {handleTouchTap(concept.text)}}
            >
              {concept.text.length < 17 ? concept.text : concept.text.slice(0, 15) + '...'}
            </Chip>
          }
        })}
      </div>
      <div>
        <div className="sharebutton">
          <FacebookShareButton url={article.url}>
            <FacebookIcon size={22} square />
          </FacebookShareButton>
        </div>
        <div className="sharebutton">
          <TwitterShareButton url={article.url}>
            <TwitterIcon size={22} square />
          </TwitterShareButton>
        </div>
        <div className="sharebutton">
          <GooglePlusShareButton url={article.url}>
            <GooglePlusIcon size={22} square />
          </GooglePlusShareButton>
        </div>
        <div className="sharebutton">
          <LinkedinShareButton url={article.url}>
            <LinkedinIcon size={22} square />
          </LinkedinShareButton>
        </div>
        <div className="sharebutton">
          <RedditShareButton url={article.url}>
            <RedditIcon size={22} square />
          </RedditShareButton>
        </div>
        <div className="sharebutton">
          <EmailShareButton url={article.url}>
            <EmailIcon size={22} square />
          </EmailShareButton>
        </div>
      </div>
    </CardText>
  </Card>
);

export default Article;
