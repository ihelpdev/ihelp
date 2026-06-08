import { createSlice } from '@reduxjs/toolkit'
import { OnDemandService, SubscriptionBaseService } from '@/lib/interfaces/service'
import servicesRaw from '@/mockup/services.json'

interface ServiceState {
  onDemand: OnDemandService[]
  subscriptions: SubscriptionBaseService[]
  loading: boolean
}

const initialState: ServiceState = {
  onDemand: servicesRaw.on_demand_services as OnDemandService[],
  subscriptions: servicesRaw.subscription_base_services as SubscriptionBaseService[],
  loading: false,
}

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    // placeholder: replace with async thunk for API integration
  },
})

export default serviceSlice.reducer
