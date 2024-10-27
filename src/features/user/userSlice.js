import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      //성공

      sessionStorage.setItem("token", response.data.token)

      return response.data
    } catch (error) {
      //실패
      // 에러값을 reducer에 저장 
      return rejectWithValue(error.error)

    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => { }
);

export const logout = () => (dispatch) => {
  dispatch(logoutUser());
  sessionStorage.removeItem("token")
 };

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password })
      // 성공
      // 1. 성공 토스트 메시지 보여주기 
      // 2. 로그인 페이지 리다이렉트 

      // uiSlice 의 reducer 액션을 호출한다. 
      dispatch(showToastMessage({ message: "회원 가입을 성공했습니다! ", status: "success" }))
      navigate('/login')

      return response.data.data     // 값을 리턴을 해야 나중에 Reducer 에서 값을 받을 수 있다. 
    } catch (error) {
      // 실패
      // 1. 실패 토스트 메시지 보여준다. 
      // 2. 에러값을 저장한다. 

      dispatch(showToastMessage({ message: "회원가입에 실패 했습니다.", status: "error" }))
      return rejectWithValue(error.error)
    }
  }
);

export const loginWithToken = createAsyncThunk(   // 세가지 장점: 상태 세가지 반환, 
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try{
      const response = await api.get("/user/me")
      return response.data
    }catch(error){
      return rejectWithValue(error.error)
    }
   }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.loginError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;   // loading spinner on 

      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;  // loading spinner off 
        state.registrationError = null // registration 관련 에러가 있었을 수도 있으니 초기화  
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action)=>{
        state.user = action.payload.user
      })
  },
});
export const { clearErrors, logoutUser } = userSlice.actions;
export default userSlice.reducer;
