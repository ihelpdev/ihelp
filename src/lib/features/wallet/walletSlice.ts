import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Transaction {
  id:          string
  date:        string
  description: string
  amount:      number
  type:        'credit' | 'debit' | 'escrow'
  status:      'completed' | 'locked' | 'pending'
}

interface WalletState {
  deposited_funds_ngn: number
  escrow_locked_ngn:   number
  transactions:        Transaction[]
  loading:             boolean
}

const initialState: WalletState = {
  deposited_funds_ngn: 125000,
  escrow_locked_ngn:   45000,
  transactions: [
    { id: 'tx_01', date: '2026-06-08', description: 'Deposit via Card',                   amount:  50000, type: 'credit', status: 'completed' },
    { id: 'tx_02', date: '2026-06-05', description: 'Escrow locked — Plumbing Repair',    amount:  -5000, type: 'escrow', status: 'locked'    },
    { id: 'tx_03', date: '2026-06-01', description: 'Payment released — Housekeeping',    amount: -10000, type: 'debit',  status: 'completed' },
  ],
  loading: false,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    lockEscrow(state, action: PayloadAction<{ amount: number; description: string }>) {
      const { amount, description } = action.payload
      state.deposited_funds_ngn -= amount
      state.escrow_locked_ngn   += amount
      state.transactions.unshift({
        id:          `tx_${Date.now()}`,
        date:        new Date().toISOString().slice(0, 10),
        description,
        amount:      -amount,
        type:        'escrow',
        status:      'locked',
      })
    },

    releaseEscrow(state, action: PayloadAction<{ amount: number; description: string }>) {
      const { amount, description } = action.payload
      // Move funds out of escrow back to available (job completed → merchant paid)
      state.escrow_locked_ngn   -= amount
      state.deposited_funds_ngn += 0  // customer already paid; this is just state cleanup
      state.transactions.unshift({
        id:          `tx_${Date.now()}`,
        date:        new Date().toISOString().slice(0, 10),
        description,
        amount:      -amount,          // outflow from customer wallet
        type:        'debit',
        status:      'completed',
      })
    },
  },
})

export const { lockEscrow, releaseEscrow } = walletSlice.actions
export default walletSlice.reducer
