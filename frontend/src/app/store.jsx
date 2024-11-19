import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../features/auth/AuthSlice";
import BrandReducer from "../features/Brand/BrandSlice";
import ProductReducer from "../features/Product/ProductSlice";
import CategoryReducer from "../features/Category/CategorySlice";


const rootReducer = combineReducers({
  auth: AuthReducer,
  brand: BrandReducer,
  product: ProductReducer,
  category: CategoryReducer,
  
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
