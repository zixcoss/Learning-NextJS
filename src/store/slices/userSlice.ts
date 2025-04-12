import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as serverService from "@/services/serverService"

interface UserState{
    username: string;
    accessToken: string;
    error?: string;
    status: "fetching" | "success" | "failed" | "init";
    isAuthenticated: boolean;
    isAuthenticating: boolean;
};

interface SignAction{
    username: string;
    password: string;
};

const initialState:UserState = {
    username: "",
    accessToken: "",
    status: "init",
    isAuthenticated: false,
    isAuthenticating: true,
};

export const signUp = createAsyncThunk(
    "user/signup",
    async (credential:SignAction) => {
        const response = await serverService.signUp(credential);
        return response;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(signUp.pending, (state) => {
            state.status = "fetching";
        });

        builder.addCase(signUp.fulfilled, (state, action)=>{
            state.status = "success";
        });

        builder.addCase(signUp.rejected, (state) => {
            state.status = "failed";
        });
    }
});

export default userSlice.reducer;
export const userSelector = (state: RootState) => state.userReducer;