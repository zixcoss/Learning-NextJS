import { ProductData } from "@/src/models/product.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as serverService from "@/services/serverService";
import { RootState } from "../store";

interface ProductState{
    products: ProductData[];
}

const initialState: ProductState = {
    products: []
};

export const getProducts = createAsyncThunk(
    "product/get",
    async (keyword?: string) => {
        const response = await serverService.getProduct(keyword);
        return response;
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder.addCase(getProducts.fulfilled, (state, action)=>{
            state.products = action.payload;
        });
    }
});

export default productSlice.reducer;
export const productSelector = (store: RootState) => store.productReducer;