import {configureStore} from '@reduxjs/toolkit'
import authenticationSliceReducer from './AuthenticationSlice'
import userProfileSliceReducer from './ProfileSlice'

export default configureStore({
    reducer:{
        authentication_user:authenticationSliceReducer,
        profile_details:userProfileSliceReducer
    }
})