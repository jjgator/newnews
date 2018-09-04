import axios from 'axios';
//import { UnitedStates } from '../../../watson/restructured_data.js'
import * as sampleData from '../../../watson/restructured_data.js';

//import this into the map
export const selectWord = (word) => {
  return {
    type: 'SELECT_WORD',
    payload: word
  }
};

export const selectTag = (tag) => {
  return {
    type: 'SELECT_TAG',
    payload: tag
  }
};

export const hideModal = () => {
  return {
    type: 'HIDE_MODAL'
  }
};
// export const getArticles = () => {
//   return {
//     type: 'GET_ARTICLES',
//     payload: UnitedStates
//   }
// }

// export const getArticles = (word) => {
//   let keyword = word.split(' ').join('').toLowerCase();
//   console.log('keyword in actions: ', keyword);
//   return {
//     type: 'GET_ARTICLES',
//     payload: sampleData[keyword]
//   }
// }

/* PUT IN MAP component
function mapDispatchToProps (dispatch) {
  return {
  bindActionCreators({selectWord: selectWord}, dispatch)
}
}
*/

export const getArticles = (query) => {
  return (dispatch) => {
    //change when route is set
    axios.get('/articles/' + query, {params: {query: query}})
    .then( response => {
      dispatch({type: 'GET_ARTICLES', payload: response.data})
    })
  }
};
//
// export default getKeywords = () => {
//   return (dispatch) => {
//     //change when route is set
//     axios.get('keyword route')
//     .then( response => {
//       dispatch({type: 'GET_KEYWORDS', payload: response.data})
//     })
//     .catch( error => {
//       console.log(error)
//     })
//   }
// }
