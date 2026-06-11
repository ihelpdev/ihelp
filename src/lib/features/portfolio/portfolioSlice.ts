import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ServiceUnit = 'hour' | 'job' | 'fixed_diagnostic' | 'sq_meter' | 'unit'

export const UNIT_LABELS: Record<ServiceUnit, string> = {
  hour:              'Per Hour',
  job:               'Per Job',
  fixed_diagnostic:  'Fixed (Diagnostic)',
  sq_meter:          'Per sqm',
  unit:              'Per Unit',
}

export interface ListingDetails {
  yearsExperience:    number
  toolsProvided:      boolean
  coverageAreaKm:     number
  availabilityDays:   string[]
  portfolioImageUrls: string[]
  certifications:     string[]
  notes:              string        // technical / internal notes
}

export interface MerchantListing {
  id:          string
  merchantId:  string
  name:        string
  description: string
  category:    string
  tags:        string[]
  coverImageUrl: string | null
  baseRateNgn: number
  unit:        ServiceUnit
  notes:       string              // public-facing brief note shown on the card
  details:     ListingDetails
  isActive:    boolean
  createdAt:   string
}

const BLANK_DETAILS: ListingDetails = {
  yearsExperience:    1,
  toolsProvided:      false,
  coverageAreaKm:     10,
  availabilityDays:   [],
  portfolioImageUrls: [],
  certifications:     [],
  notes:              '',
}

export const blankListing = (): Omit<MerchantListing, 'id' | 'merchantId' | 'createdAt'> => ({
  name:        '',
  description: '',
  category:    '',
  tags:        [],
  coverImageUrl: null,
  baseRateNgn: 0,
  unit:        'hour',
  notes:       '',
  details:     { ...BLANK_DETAILS },
  isActive:    true,
})

interface PortfolioState {
  listings: MerchantListing[]
  loading:  boolean
}

const initialState: PortfolioState = {
  listings: [],
  loading:  false,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setListings(state, action: PayloadAction<MerchantListing[]>) {
      state.listings = action.payload
    },
    addListing(state, action: PayloadAction<MerchantListing>) {
      state.listings.unshift(action.payload)
    },
    updateListing(state, action: PayloadAction<MerchantListing>) {
      const idx = state.listings.findIndex(l => l.id === action.payload.id)
      if (idx !== -1) state.listings[idx] = action.payload
    },
    removeListing(state, action: PayloadAction<string>) {
      state.listings = state.listings.filter(l => l.id !== action.payload)
    },
  },
})

export const { setListings, addListing, updateListing, removeListing } = portfolioSlice.actions
export default portfolioSlice.reducer
