import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as serverService from "@/services/serverService";
import httpClient from "@/src/utils/httpClient";
import { AxiosRequestConfig } from "axios";
import { UserData } from "@/src/models/user.model";

interface UserState {
  username: string;
  accessToken: string;
  error?: string;
  status: "fetching" | "success" | "failed" | "init";
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user?: UserData;
}

interface SignAction {
  username: string;
  password: string;
}

const initialState: UserState = {
  username: "",
  accessToken: "",
  status: "init",
  isAuthenticated: false,
  isAuthenticating: true,
};

export const signUp = createAsyncThunk(
  "user/signup",
  async (credential: SignAction) => {
    const response = await serverService.signUp(credential);
    return response;
  }
);

export const signIn = createAsyncThunk(
  "user/signin",
  async (credential: SignAction) => {
    const response = await serverService.signIn(credential);

    if (response.result != "ok") {
      throw new Error("Login failed");
    }

    httpClient.interceptors.request.use((config?: AxiosRequestConfig | any) => {
      if (config && config.headers) {
        config.headers["Authorization"] = `Bearer ${response.token}`;
      }
      return config;
    });
    return response;
  }
);

export const signOut = createAsyncThunk("user/signout", async () => {
  await serverService.signOut();
});

export const getSession = createAsyncThunk("user/fetchSession", async () => {
  const response = await serverService.getSession();
  if (response) {
    httpClient.interceptors.request.use((config?: AxiosRequestConfig | any) => {
      if (config && config.headers && response.user) {
        config.headers["Authorization"] = `Bearer ${response.user?.token}`;
      }
      return config;
    });
  }
  return response;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Register case
    builder.addCase(signUp.pending, (state) => {
      state.status = "fetching";
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.status = "success";
    });

    builder.addCase(signUp.rejected, (state) => {
      state.status = "failed";
    });

    //Login case
    builder.addCase(signIn.pending, (state) => {
      state.status = "fetching";
    });

    builder.addCase(signIn.fulfilled, (state, action) => {
      state.status = "success";
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
      state.isAuthenticating = false;
      state.username = action.payload.username;
    });

    builder.addCase(signIn.rejected, (state) => {
      state.status = "failed";
      state.accessToken = "";
      state.isAuthenticated = false;
      state.isAuthenticating = false;
    });

    builder.addCase(signOut.fulfilled, (state) => {
      state.accessToken = "";
      state.isAuthenticated = false;
      state.isAuthenticating = false;
    });

    builder.addCase(getSession.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      if (action.payload && action.payload.user && action.payload.user.token) {
        state.accessToken = action.payload.user.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    });
  },
});

export default userSlice.reducer;
export const userSelector = (state: RootState) => state.userReducer;
