import React, { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import EditTodo from "./EditTodo";
import TodoItem from "./TodoItem";
import { useSelector, useDispatch } from "react-redux";
import { apiClient } from "../../utils/request";
import {
  CREATE_TODO_API_REQUEST,
  CREATE_TODO_SUCCESS_RESPONSE,
  CREATE_TODO_FAILURE_RESPONSE,
  UPDATE_TODO_API_REQUEST,
  UPDATE_TODO_SUCCESS_RESPONSE,
  UPDATE_TODO_FAILURE_RESPONSE,
  DELETE_TODO_API_REQUEST,
  DELETE_TODO_SUCCESS_RESPONSE,
  DELETE_TODO_FAILURE_RESPONSE,
} from "../../constants/actionTypes";
import { CircularProgress, Typography } from "@mui/material";
import { getTodos } from "../../actions/todos";
import { useNavigate } from "react-router-dom";

function ToDo() {
  const todoState = useSelector((state) => state.todoReducer.todos);
  const loading = useSelector((state) => state.loading);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [todo, setTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  useEffect(() => {
    dispatch(getTodos);
  }, [dispatch,navigate]);

  function handleAddInputChange(e) {
    setTodo(e.target.value);
  }

  function handleEditInputChange(e) {
    setCurrentTodo({ ...currentTodo, name: e.target.value });
    console.log(currentTodo);
  }

  async function handleAddFormSubmit(e) {
    e.preventDefault();

    // if (todo !== "") {
    //   setTodos([
    //     ...todos,
    //     {
    //       id: new Date(),
    //       text: todo.trim()
    //     }
    //   ]);
    // }

    try {
      dispatch({
        type: CREATE_TODO_API_REQUEST,
        payload: {},
      });

      const { data } = await apiClient
        .post("/todo/createTodo", { name: todo })
        .then((response) => {
          return response;
        });
      console.log("data_create:::", data.data.user);
      dispatch({ type: CREATE_TODO_SUCCESS_RESPONSE, payload: data.data.user });
    } catch (error) {
      // console.log(error.message);
      dispatch({
        type: CREATE_TODO_FAILURE_RESPONSE,
        payload: error.message,
      });
    }

    setTodo("");
  }

  async function handleEditFormSubmit(e) {
    e.preventDefault();

    try {
      dispatch({
        type: UPDATE_TODO_API_REQUEST,
        payload: {},
      });
      const { data } = await apiClient
        .patch(`/todo/updateTodo/${currentTodo._id}`, {
          name: currentTodo.name,
          completed: currentTodo.completed,
        })
        .then((response) => {
          return response;
        });
      setCurrentTodo({ text: "" });
      setIsEditing(false);


      dispatch({ type: UPDATE_TODO_SUCCESS_RESPONSE, payload: data.data.todo });
    } catch (error) {
      dispatch({
        type: UPDATE_TODO_FAILURE_RESPONSE,
        payload: error.message,
      });
    }
  }

  async function handleDeleteClick(id) {
    

    try {
      dispatch({
        type: DELETE_TODO_API_REQUEST,
        payload: {},
      });
      const { data } = await apiClient
        .delete(`/todo/deleteTodo/${id}`)
        .then((response) => {
          return response;
        });
      dispatch({
        type: DELETE_TODO_SUCCESS_RESPONSE,
        payload: data.data.user.todos,
      });
    } catch (error) {
      dispatch({
        type: DELETE_TODO_FAILURE_RESPONSE,
        payload: error.message,
      });
    }
  }

 

  function handleEditClick(todo) {
    console.log("handle editid::", todo);
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  return (
    <div className="App">
      {isEditing ? (
        <EditTodo
          currentTodo={currentTodo}
          setIsEditing={setIsEditing}
          onEditInputChange={handleEditInputChange}
          onEditFormSubmit={handleEditFormSubmit}
        />
      ) : (
        <AddTodo
          todo={todo}
          onAddInputChange={handleAddInputChange}
          onAddFormSubmit={handleAddFormSubmit}
        />
      )}

      {loading ? (
        <CircularProgress />
      ) : !todoState.length ? (
        <Typography variant="h3">No To-Do available</Typography>
      ) : (
        <ul className="list-group mt-3">
          {todoState.map((todo) => (
            <TodoItem
              todo={todo}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ToDo;
