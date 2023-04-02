import React from "react";
import { Button } from "react-bootstrap";

function EditTodo({
  currentTodo,
  setIsEditing,
  onEditInputChange,
  onEditFormSubmit,
}) {
  return (
    <form onSubmit={onEditFormSubmit} className="form-inline text-center mt-4">
      <div className="form-group mb-2">
        <h2>Edit Todo</h2>
        <input
          name="updateTodo"
          type="text"
          placeholder="Update todo"
          className="form-control mt-2 mb-2"
          value={currentTodo.name}
          onChange={onEditInputChange}
        />
        <div className="d-flex justify-content-center gap-2">
          <Button type="submit" onClick={onEditFormSubmit}>
            Update
          </Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}

export default EditTodo;
