import { CategoryService } from "./CategoryService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";

export const category = createAsyncThunk("category", async () => {
  try {
    return await CategoryService.Category();
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

export const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //category
      .addCase(category.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(category.fulfilled, (state, action) => {
        console.log(action.payload, "payload");
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.isError = false;
        state.ismessage = action.payload.message;
        state.brand = action.payload;
      })
      .addCase(category.rejected, (state, action) => {
        state.isError = true;
        state.ismessage = action.payload.message;
      });
  },
});

export const { resetState } = CategorySlice.actions;
export default CategorySlice.reducer;
