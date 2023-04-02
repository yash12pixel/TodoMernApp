import React from "react";
import { Button } from "react-bootstrap";

function TodoItem({ todo, onEditClick, onDeleteClick }) {
  return (
    <li
      key={todo.id}
      className="list-group-item d-flex gap-2 justify-content-center"
    >
      <h3>{todo.name}</h3>
      <Button onClick={() => onEditClick(todo)}>Edit</Button>
      <Button onClick={() => onDeleteClick(todo._id)}>Delete</Button>
    </li>
  );
}

export default TodoItem;
