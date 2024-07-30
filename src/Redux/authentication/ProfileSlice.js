import {createSlice} from '@reduxjs/toolkit'

export const userProfileSlice=createSlice(
    {
        name: 'set_profile_details',
        initialState: {
          username: null,
          email:null,
          phone:null,
          fburl:null,
          linkedinurl:null,
          about:null,
          profile_pic:null
        },

        reducers: {
            set_profile_details: (state, action) => {
              state.username = action.payload.username;
              state.email = action.payload.email;
              state.phone = action.payload.phone;
              state.fburl = action.payload.fburl;
              state.linkedinurl = action.payload.linkedinurl;
              state.about = action.payload.about;
              state.profile_pic = action.payload.profile_pic;
            }
          }
})

export const {set_profile_details} =  userProfileSlice.actions

export default userProfileSlice.reducer