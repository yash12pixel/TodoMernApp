import React from "react";
import { Button, Form } from "react-bootstrap";

function AddTodo({ todo, onAddFormSubmit, onAddInputChange }) {
  return (
    <Form onSubmit={onAddFormSubmit} className="form-inline text-center mt-4">
      <div className="form-group mb-2">
        <input
          name="todo"
          type="text"
          placeholder="Create new todo"
          className="form-control mt-3 mb-3"
          value={todo}
          onChange={onAddInputChange}
        />
        <Button type="submit">Add Todo</Button>
      </div>
    </Form>
  );
}

export default AddTodo;
