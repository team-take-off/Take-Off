const DEFAULT_STATE = {};

const userReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return DEFAULT_STATE;
    case 'LOGOUT':
      return DEFAULT_STATE;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;
