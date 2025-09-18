import { configureStore } from '@reduxjs/toolkit'
import chatslice from "./chatslice"

export const store = configureStore({
  reducer: {
    chat:chatslice
  },
})