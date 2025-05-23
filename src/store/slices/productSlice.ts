import { ProductData } from "@/src/models/product.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as serverService from "@/services/serverService";
import { RootState } from "../store";

interface ProductState {
  products: ProductData[];
}

const initialState: ProductState = {
  products: [],
};

export const getProducts = createAsyncThunk(
  "product/get",
  async (keyword?: string | undefined) => {
    const response = await serverService.getProduct(keyword);
    return response;
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (values: ProductData) => {
    let data = new FormData();
    data.append("name", values.name);
    data.append("price", String(values.price));
    data.append("stock", String(values.stock));
    if (values.file) {
      data.append("image", values.file);
    }
    const response = await serverService.addProduct(data);
    return response;
  }
);

export const editProduct = createAsyncThunk(
  "product/addProduct",
  async (values: ProductData) => {
    let data = new FormData();
    data.append("id", String(values.id));
    data.append("name", values.name);
    data.append("price", String(values.price));
    data.append("stock", String(values.stock));

    if (values.file) {
      data.append("image", values.file);
    }
    const response = serverService.editProduct(data);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id:string) => {
    await serverService.deleteProduct(id);
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export default productSlice.reducer;
export const productSelector = (state: RootState) => state.productReducer;
