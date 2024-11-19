import { BrandService } from "./BrandService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";

export const brand = createAsyncThunk("brand", async () => {
  try {
    return await BrandService.Brand();
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

export const BrandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //brand
      .addCase(brand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(brand.fulfilled, (state, action) => {
        console.log(action.payload, "payload");
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.isError = false;
        state.ismessage = action.payload.message;
        state.brand = action.payload;
      })
      .addCase(brand.rejected, (state, action) => {
        state.isError = true;
        state.ismessage = action.payload.message;
      });
  },
});

export const { resetState } = BrandSlice.actions;
export default BrandSlice.reducer;
