import { combineReducers } from "redux";

function activeWordReducer (state=null, action) {
  switch(action.type) {
    case 'SELECT_WORD':
      return action.payload
      break;
  }
  return state
}

//change when response structure is set
function articleReducer(state=null, action) {
  switch(action.type) {
    case 'GET_ARTICLES':
     return action.payload
     break;
  }
  return state
}

function activeTagReducer(state = {showModal: false}, action) {
  switch(action.type) {
    case 'SELECT_TAG':
      return {tag: action.payload, showModal: true} 
      break;
    case 'HIDE_MODAL': {
      return {showModal: false}
    }
  }
  return state;
}
//
// //change when response structure is set
// function keywordReducer(state=[], action) {
//   switch (action.type) {
//     case "GET_KEYWORDS": {
//       return action.payload
//     }
//   }
// }

export const allReducers = combineReducers({
  articles: articleReducer,
  activeWord: activeWordReducer,
  activeTag: activeTagReducer
});
