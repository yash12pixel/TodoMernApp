import {
  FETCH_ALL_TODO_API_REQUEST,
  FETCH_ALL_TODO_SUCCESS_RESPONSE,
  FETCH_ALL_TODO_FAILURE_RESPONSE,
  FETCH_ALL_TODOS_API_REQUEST,
  FETCH_ALL_TODOS_SUCCESS_RESPONSE,
  FETCH_ALL_TODOS_FAILURE_RESPONSE,
} from "../constants/actionTypes";
import { apiClient } from "../utils/request";

export const getTodos = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ALL_TODO_API_REQUEST });

    const { data } = await apiClient
      .get("/todo/getAllTodoByUser")
      .then((response) => {
        return response;
      });
    dispatch({
      type: FETCH_ALL_TODO_SUCCESS_RESPONSE,
      payload: data.data.todos.todos,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_TODO_FAILURE_RESPONSE,
      payload: error.message,
    });
  }
};

export const getAllTodos = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ALL_TODOS_API_REQUEST });

    const { data } = await apiClient
      .get("/todo/getAllTodo")
      .then((response) => {
        return response;
      });
    dispatch({
      type: FETCH_ALL_TODOS_SUCCESS_RESPONSE,
      payload: data.data.todos,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_TODOS_FAILURE_RESPONSE,
      payload: error.message,
    });
  }
};
