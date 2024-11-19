
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";
import { ProductService } from "./ProductService";

export const product = createAsyncThunk("product", async () => {
  try {
    return await ProductService.Product();
  } catch (error) {
    throw new error();
  }
});

export const reset = createAction("reset");

const initialState = {
  isLoading: true,
  isSuccess: false,
  isError: false,
  ismessage: "",
};

export const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //Product
      .addCase(product.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(product.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.isError = false;
        state.ismessage = action.payload.message;
        state.product = action.payload;
      })
      .addCase(product.rejected, (state, action) => {
        state.isError = true;
        state.ismessage = action.payload.message;
      });
  },
});

export const { resetState } = ProductSlice.actions;
export default ProductSlice.reducer;
