import { TOGGLE_THEME } from "../actionTypes/app";
const initialState = {
  theme: localStorage.getItem(TOGGLE_THEME) || "light",
};
const app = (state = initialState, action): any => {
  switch (action.type) {
    case TOGGLE_THEME:
      const theme = action.payload;
      localStorage.setItem(TOGGLE_THEME, theme);
      return { ...state, theme };
    default:
      return state;
  }
};

export default app;
