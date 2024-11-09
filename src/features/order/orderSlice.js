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
  recentAddress: null,
  previousAddresses: [],

};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload)
      dispatch(getCartQty())
      // if (response.status !== 200) throw new Error(response.error)
      return response.data.orderNum
    } catch (error) {
      const errorMessage = error.error || error.message || "주문 실패 했습니다!";
      dispatch(showToastMessage({ message: errorMessage, status: "error" }));
      return rejectWithValue(errorMessage)
    }

  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (page = 1, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/order/me?page=${page}`);
      if (response.status !== 200) throw new Error(response.error)
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order", {
        params: { ...query },
      });

      if (response.status !== 200) throw new Error(response.error)
      return response.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status, page }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });
      if (response.status !== 200) throw new Error(response.error);
      dispatch(showToastMessage({ message: "주문 상태 변경 완료", status: "success" }))
      dispatch(getOrderList({ page }))
      return response.data

    } catch (error) {
      return rejectWithValue(error.error)

    }
  }
);

// New action to fetch the most recent address
export const fetchRecentAddress = createAsyncThunk(
  "order/fetchRecentAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/recent-address");
   
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message);
    }
  }
);

// New action to fetch all previous addresses
export const fetchPreviousAddresses = createAsyncThunk(
  "order/fetchPreviousAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/previous-addresses");
      const addresses = response.data.data;

      // 중복 제거 로직: 모든 주요 필드 고려
      const uniqueAddresses = addresses.filter((address, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.address === address.address &&
            a.city === address.city &&
            a.zip === address.zip &&
            a.contact.firstName === address.contact.firstName &&
            a.contact.lastName === address.contact.lastName
        )
      );

      return uniqueAddresses;
    } catch (error) {
      return rejectWithValue(error.error || error.message);
    }
  }
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
      .addCase(getOrderList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload.data; // 전체 주문 리스트 상태에 반영
        state.totalPageNum = action.payload.totalPageNum || 1; // 페이지 정보 상태에 반영
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.selectedOrder = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentAddress.fulfilled, (state, action) => {
        state.recentAddress = action.payload;
      })
      .addCase(fetchPreviousAddresses.fulfilled, (state, action) => {
        state.previousAddresses = action.payload;
      });

  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
