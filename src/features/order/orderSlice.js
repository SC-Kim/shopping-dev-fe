import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload)
      dispatch(getCartQty())
      if (response.status !== 200) throw new Error(response.error)
      return response.data.orderNum
    } catch (error) {
      return rejectWithValue(error.error)
    }

  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (page = 1, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/order/me?page=${page}`);
      if (response.status !== 200) throw new Error(response.error)
      // console.log("response.data??", response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => { }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => { }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      
        state.orderList = action.payload.data; // 전체 주문 리스트 상태에 반영
        state.totalPageNum = action.payload.totalPageNum || 1; // 페이지 정보 상태에 반영
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
