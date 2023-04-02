import { SET_CURRENT_USER, ERROR_SET_USER } from "../constants/actionTypes";
import { apiClient } from "../utils/request";

export const getUser = () => async (dispatch) => {
  try {
    const { data } = await apiClient.get("/user/getUser").then((response) => {
      return response;
    });
    dispatch({
      type: SET_CURRENT_USER,
      payload: data.data.user,
    });
  } catch (error) {
    dispatch({
      type: ERROR_SET_USER,
      payload: error.message,
    });
  }
};
