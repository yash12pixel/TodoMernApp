const express = require("express");
const todoModel = require("../models/toDoList");
const userModel = require("../models/user");
const ErrorMessages = require("../constants/error");
const SuccessMessages = require("../constants/messages");
const { errorResponse, responseWithData } = require("../responses/response");
const passport = require("passport");
require("../utils/passport")(passport);

const router = express.Router();

router.post(
  "/createTodo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    try {
      if (!name) {
        res
          .status(403)
          .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Name"));
      }
      const todo = await todoModel.create({
        name: name,
        user: userId,
      });

      await todo.save();

      await userModel.findByIdAndUpdate(
        { _id: userId },
        { $push: { todos: todo._id } },
        { new: true }
      );
      return responseWithData(
        res,
        true,
        SuccessMessages.TODO.TODO_CREATED_SUCCESSFULLY,
        { user: todo },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Create Todo",
          error?.message
        ),
        500
      );
    }
  }
);

router.patch(
  "/updateTodo/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const { name, completed } = req.body;

    try {
      const isTodo = await todoModel.findOne({ _id: id });

      if (!isTodo) {
        return errorResponse(res, ErrorMessages.AUTH.INVALID_ID(id), 404);
      }

      const updateTodo = await todoModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            completed: completed,
          },
        },
        { new: true }
      );

      return responseWithData(
        res,
        true,
        SuccessMessages.TODO.TODO_UPDATED_SUCCESSFULLY,
        { todo: updateTodo },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Update Todo",
          error?.message
        ),
        500
      );
    }
  }
);

router.get(
  "/getAllTodo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      if (user.role != "Admin") {
        return res
          .status(400)
          .json({
            success: false,
            message: "Only admin can view all the todo list",
          });
      }
      const allTodo = await todoModel.find().populate("user");

      return responseWithData(
        res,
        true,
        SuccessMessages.TODO.TODO,
        { todos: allTodo },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Get All Todo",
          error?.message
        ),
        500
      );
    }
  }
);

router.get(
  "/getAllTodoByUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;

    try {
      const allTodoByUser = await userModel.findById(userId).populate("todos");

      return responseWithData(
        res,
        true,
        SuccessMessages.TODO.TODO_BY_USER,
        { todos: allTodoByUser },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Get All Todo By User",
          error?.message
        ),
        500
      );
    }
  }
);

router.delete(
  "/deleteTodo/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const todoid = req.params.id;
    let userId = req.user._id;
    const isTodo = await todoModel.findById(todoid);
    try {
      if (!isTodo)
        return errorResponse(res, ErrorMessages.AUTH.INVALID_ID(id), 404);

      await todoModel.findByIdAndDelete(todoid);

      const findUser = await userModel.findOne({ _id: userId });
      const updateTodos = findUser.todos.filter((todos) => {
        return todos != todoid;
      });

      const updateUser = await userModel
        .findOneAndUpdate({ _id: userId }, { $set: { todos: updateTodos } })
        .populate("todos");

      return responseWithData(
        res,
        true,
        SuccessMessages.TODO.TODO_DELETED_SUCCESSFULLY,
        { user: updateUser },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Delete Todo",
          error?.message
        ),
        500
      );
    }
  }
);

module.exports = router;
