import React, { useEffect } from "react";
import { getAllTodos } from "../../actions/todos";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { apiClient } from "../../utils/request";
import {
  DELETE_TODO_API_REQUEST,
  DELETE_TODO_SUCCESS_RESPONSE,
  DELETE_TODO_FAILURE_RESPONSE,
} from "../../constants/actionTypes";
import { CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ViewAllToDos() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const allTodos = useSelector((state) => state.allToDosReducer.todos);
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(getAllTodos());
  }, [dispatch,navigate]);

  let onDeleteClick = (id) => {
    try {
      dispatch({
        type: DELETE_TODO_API_REQUEST,
        payload: {},
      });
      apiClient
        .delete(`/todo/deleteTodo/${id}`)
        .then((response) => {
          dispatch({
            type: DELETE_TODO_SUCCESS_RESPONSE,
            payload: response.data.data.user.todos,
          });
          return response;
        });
    } catch (error) {
      console.log(error.message);
      dispatch({
        type: DELETE_TODO_FAILURE_RESPONSE,
        payload: error.message,
      });
    }
  };

  return (
    <>
      <h1 className="text-center">All To-Do</h1>
      {loading ? (
        <CircularProgress />
      ) : !allTodos.length ? (
        <Typography variant="h3" className="text-center">
          No To-Do available
        </Typography>
      ) : (
        <ul className="list-group mt-3">
          {allTodos.map((todo) => (
            <li
              key={todo._id}
              className="list-group-item d-flex gap-2 justify-content-center"
            >
              <h3>{todo.name}</h3>
              <Button onClick={() => onDeleteClick(todo._id)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ViewAllToDos;
