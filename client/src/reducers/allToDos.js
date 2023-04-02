import {
    FETCH_ALL_TODOS_API_REQUEST,
    FETCH_ALL_TODOS_SUCCESS_RESPONSE,
    FETCH_ALL_TODOS_FAILURE_RESPONSE,
   
    DELETE_TODO_API_REQUEST,
    DELETE_TODO_FAILURE_RESPONSE,
    DELETE_TODO_SUCCESS_RESPONSE,
  } from "../constants/actionTypes";
  
  const initialState = {
    isWarning: false,
    todos: [],
    loading: false,
    message: "",
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ALL_TODOS_API_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_ALL_TODOS_SUCCESS_RESPONSE:
        return {
          ...state,
          loading: false,
          todos: action.payload,
          message: "Todos fetch successfully",
        };
      case FETCH_ALL_TODOS_FAILURE_RESPONSE:
        return {
          ...state,
          isWarning: true,
          loading: false,
          message: action.payload,
        };
      case DELETE_TODO_API_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case DELETE_TODO_SUCCESS_RESPONSE:
        return {
          ...state,
          loading: false,
          todos: action.payload,
        };
      case DELETE_TODO_FAILURE_RESPONSE:
        return {
          ...state,
          isWarning: true,
          loading: false,
          message: action.payload,
        };
      default:
        return state;
    }
  };
  