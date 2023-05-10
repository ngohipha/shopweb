import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token:null
  },
  reducers: {
    register: (state,action)=>{
        state.isLoggedIn = action.payload.isLoggedIn
        state.current = action.payload.userData
        state.token = action.payload.token
    }
  },
//   extraReducers: (builder) => {
//     builder.addCase(getNewProduct.pending, (state) => {
//       state.isLoading = true;
//     });

//     builder.addCase(getNewProduct.fulfilled, (state, action) => {
//       // tat trang thai loading luu thong tin
//       state.isLoading = false;
//       state.newProducts = action.payload;
//     });
//     // khi thuc hien action that bai (Promise rejected)

//     builder.addCase(getNewProduct.rejected, (state, action) => {
//       //tat trang thai loading luu htong bao loi vao store
//       state.isLoading = false;
//       state.errorMessage = action.payload.message;
//     });
//   },
});
export const { register} = userSlice.actions
export default userSlice.reducer;
