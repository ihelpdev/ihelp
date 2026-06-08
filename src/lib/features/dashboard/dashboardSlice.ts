import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type BookingType = 'on_demand' | 'subscription'
export type BookingStatus = 'pending' | 'active' | 'completed'

export interface Booking {
  id: string
  serviceId: string
  serviceName: string
  type: BookingType
  amount: number
  frequency?: string
  status: BookingStatus
  date: string
}

interface DashboardState {
  bookings: Booking[]
  deposited_funds_ngn: number
  escrow_locked_ngn: number
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit' | 'escrow'
  status: 'completed' | 'locked' | 'pending'
}

const initialState: DashboardState = {
  bookings: [],
  deposited_funds_ngn: 125000,
  escrow_locked_ngn: 45000,
  transactions: [
    { id: 'tx_01', date: '2026-06-08', description: 'Deposit via Card', amount: 50000, type: 'credit', status: 'completed' },
    { id: 'tx_02', date: '2026-06-05', description: 'Escrow locked for Plumbing Repair', amount: -15000, type: 'escrow', status: 'locked' },
    { id: 'tx_03', date: '2026-06-02', description: 'Payment released for Housekeeping', amount: -10000, type: 'debit', status: 'completed' },
  ],
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<{ booking: Booking; cost: number }>) => {
      const { booking, cost } = action.payload
      state.bookings.unshift(booking)
      state.deposited_funds_ngn -= cost
      state.escrow_locked_ngn += cost
      state.transactions.unshift({
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        description: `Escrow locked: ${booking.serviceName}`,
        amount: -cost,
        type: 'escrow',
        status: 'locked',
      })
    },
  },
})

export const { addBooking } = dashboardSlice.actions
export default dashboardSlice.reducer
