import {
    FETCH_ALL_TODO_API_REQUEST,
    FETCH_ALL_TODO_SUCCESS_RESPONSE,
    FETCH_ALL_TODO_FAILURE_RESPONSE,
    CREATE_TODO_API_REQUEST,
    CREATE_TODO_SUCCESS_RESPONSE,
    CREATE_TODO_FAILURE_RESPONSE,
    DELETE_TODO_API_REQUEST,
    DELETE_TODO_FAILURE_RESPONSE,
    DELETE_TODO_SUCCESS_RESPONSE,
    UPDATE_TODO_API_REQUEST,
    UPDATE_TODO_SUCCESS_RESPONSE,
    UPDATE_TODO_FAILURE_RESPONSE,
  } from "../constants/actionTypes";
  
  const initialState = {
    isWarning: false,
    todos: [],
    loading: false,
    message: "",
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ALL_TODO_API_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_ALL_TODO_SUCCESS_RESPONSE:
        return {
          ...state,
          loading: false,
          todos: action.payload,
          message: "Posts fetch successfully",
        };
      case FETCH_ALL_TODO_FAILURE_RESPONSE:
        return {
          ...state,
          isWarning: true,
          loading: false,
          message: action.payload,
        };
      case CREATE_TODO_API_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case CREATE_TODO_SUCCESS_RESPONSE:
        return {
          ...state,
          loading: false,
          todos: [...state.todos, action.payload],
          message: "Todo created successfully",
        };
      case CREATE_TODO_FAILURE_RESPONSE:
        return {
          ...state,
          isWarning: true,
          loading: false,
          message: action.payload,
        };
      case UPDATE_TODO_API_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case UPDATE_TODO_SUCCESS_RESPONSE:
        return {
          ...state,
          loading: false,
          todos: state.todos.map((todo) =>
            todo._id === action.payload._id ? action.payload : todo
          ),
        };
      case UPDATE_TODO_FAILURE_RESPONSE:
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
  