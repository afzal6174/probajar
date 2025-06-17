function errorReducer(state, action) {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    case "CLEAR_ERROR":
      const { [action.payload]: _, ...rest } = state.errors;
      return {
        ...state,
        errors: rest,
      };
    default:
      throw new Error(`No action matched with ${action.type}`);
  }
}

export default errorReducer;
