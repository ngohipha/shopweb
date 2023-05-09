import { createSlice } from "@reduxjs/toolkit";
import {getNewProduct} from "./asyncAction";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    newProducts: null,
    errorMessage: "",
  },
  reducers: {
    // logout:(state)=>{
    //     state.isLoading = false
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(getNewProduct.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getNewProduct.fulfilled, (state, action) => {
      // tat trang thai loading luu thong tin
      state.isLoading = false;
      state.newProducts = action.payload;
    });
    // khi thuc hien action that bai (Promise rejected)

    builder.addCase(getNewProduct.rejected, (state, action) => {
      //tat trang thai loading luu htong bao loi vao store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});
// export const { } = appSlice.actions
export default productSlice.reducer;
