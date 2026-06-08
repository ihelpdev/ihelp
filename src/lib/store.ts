import { configureStore } from '@reduxjs/toolkit'
import authReducer      from './features/auth/authSlice'
import serviceReducer   from './features/services/serviceSlice'
import jobsReducer      from './features/jobs/jobsSlice'
import walletReducer    from './features/wallet/walletSlice'
import portfolioReducer from './features/portfolio/portfolioSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth:      authReducer,
      services:  serviceReducer,
      jobs:      jobsReducer,
      wallet:    walletReducer,
      portfolio: portfolioReducer,
    },
  })
}

export type AppStore    = ReturnType<typeof makeStore>
export type RootState   = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
