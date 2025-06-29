const initialState = {
  cart: {},
};

function RootReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CART': {
      const newCart = { ...state.cart };
      newCart[action.payload[0]] = action.payload[1];
      return { ...state, cart: newCart };
    }

    case 'CLEAR_CART':
      return { ...state, cart: {} };

    case 'DELETE_CART': {
      const newCart = { ...state.cart };
      delete newCart[action.payload[0]];
      return { ...state, cart: newCart };
    }

    default:
      return state;
  }
}

export default RootReducer;
