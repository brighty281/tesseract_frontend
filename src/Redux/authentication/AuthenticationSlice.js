import { createSlice } from "@reduxjs/toolkit";
export const authenticationSlice = createSlice(
    {
     name: 'authentication_user',
     initialState: {
      userid:null,
      name:null,
      isAuthenticated:false,
      isAdmin:false,
      isTeacher:false,
     },
     reducers: {
       set_Authentication: (state, action) => {
        state.userid=action.payload.userid
        state.name=action.payload.name
        state.isAuthenticated=action.payload.isAuthenticated
        state.isAdmin=action.payload.isAdmin
        state.isTeacher=action.payload.isTeacher
       },
   
     }
 
 })

export const {set_Authentication} =  authenticationSlice.actions

export default authenticationSlice.reducer