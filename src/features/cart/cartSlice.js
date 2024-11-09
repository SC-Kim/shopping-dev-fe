import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 })
      if (response.status !== 200) throw new Error(response.error)
      dispatch(showToastMessage({ message: "카트에 아이템이 추가 됐습니다.", status: "success" }))
      return response.data.cartItemQty
    } catch (error) {
      // error 객체의 error 속성에 접근
      const errorMessage = error.error || "카트에 아이템 추가 실패"; 

      dispatch(showToastMessage({ message: errorMessage, status: "error" }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      
      const response = await api.get("/cart")
      if (response.status !== 200) throw new Error(response.error)
      return response.data.data

    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {

    try {
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      return response.data.cartItemQty

    } catch (error) {
      return rejectWithValue(error.error)
    }

  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      if (response.status !== 200) throw new Error(response.error);
      return { id, qty: value };
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.qty

    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
      state.cartList = [];
      state.totalPrice = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;

      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(getCartList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce((total, item) => total + item.productId.price * item.qty, 0)
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;

        // 삭제된 아이템을 cartList에서 제거
        state.cartList = state.cartList.filter((item) => item._id !== action.meta.arg);
        
        state.totalPrice = state.cartList.reduce((total, item) => total + item.productId.price * item.qty, 0);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(updateQty.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const { id, qty } = action.payload;
        const item = state.cartList.find((item) => item._id === id);
        if (item) {
          item.qty = qty;
        }
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(getCartQty.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload

      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
