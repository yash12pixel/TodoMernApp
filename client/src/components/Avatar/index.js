import React from "react";
import { Dropdown } from "react-bootstrap";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_CURRENT_USER } from "../../constants/actionTypes";
const AccountMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loginReducer);
  const userRole = user.user.role;
  console.log("userRole",userRole);
  return (
    <Dropdown className="ml-5" id="User">
      <Dropdown.Toggle id="dropdown-basic">
        <span className="material-icons user-icon">
          <PersonOutlineIcon />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>
          <Link to="/reset-password">
            <p style={{ color: "black" }}>Change Password</p>
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/reset-email">
            <p style={{ color: "black" }}>Change Email</p>
          </Link>
        </Dropdown.Item>
        {userRole === "Admin" && (
          <Dropdown.Item>
            <Link to="/getAllTodos">
              <p style={{ color: "black" }}>View All Todos</p>
            </Link>
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onClick={() => {
            localStorage.removeItem("token");
            dispatch({ type: REMOVE_CURRENT_USER, payload: {} });
            navigate("/login");
          }}
        >
          <p style={{ color: "black" }}>Logout</p>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AccountMenu;
