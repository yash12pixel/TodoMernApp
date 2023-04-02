import React, { useState, useEffect } from "react";
import { Container, Grow } from "@material-ui/core";
import { useDispatch } from "react-redux";
import "./todo.css";

import { getTodos } from "../../actions/todos";
import { getUser } from "../../actions/user";
import NavBar from "../../components/Navbar";
import WarningModal from "../../components/ToastModal/WarningModal";
import { useNavigate } from "react-router-dom";
import ToDo from "../../components/Todo/Todo";

const ToDos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModalObject, setShowModalObject] = useState({
    showSuccessModal: false,
    ShowWarningModal: false,
    msg: "",
  });

  useEffect(() => {
    const LoginCheck = () => {
      if (!localStorage.getItem("token")) {
        setShowModalObject({
          showSuccessModal: false,
          ShowWarningModal: true,
          msg: "Login First",
        });
        navigate("/login")
      } else {
        dispatch(getUser());
        dispatch(getTodos());
      }
    };
    LoginCheck();
  }, [dispatch,navigate]);

  
  let onCloseErrorModalLogin = () => {
    setShowModalObject({
      ...showModalObject,
      showSuccessModal: false,
      ShowWarningModal: false,
      msg: "",
    });
    navigate("/login");
  };

  return (
    <Container maxWidth="lg">
      <NavBar />
      <Grow in>
        <Container>
          <ToDo />
        </Container>
      </Grow>
      <WarningModal
        showModal={showModalObject.ShowWarningModal}
        btnText="Login"
        msg={showModalObject.msg}
        onCloseModal={() => {
          onCloseErrorModalLogin();
        }}
      ></WarningModal>
    </Container>
  );
};

export default ToDos;
