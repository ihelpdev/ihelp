import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type JobStatus   = 'pending' | 'accepted' | 'completed' | 'rejected'
export type EscrowStatus = 'locked' | 'released'
export type JobType     = 'on_demand' | 'subscription'

export interface Job {
  id:           string
  customerId:   string
  merchantId:   string | null
  serviceId:    string
  serviceName:  string
  type:         JobType
  status:       JobStatus
  escrowStatus: EscrowStatus
  amount:       number
  frequency?:   string
  date:         string
}

interface JobsState {
  jobs:    Job[]
  loading: boolean
}

const initialState: JobsState = {
  jobs:    [],
  loading: false,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs(state, action: PayloadAction<Job[]>) {
      state.jobs = action.payload
    },
    addJob(state, action: PayloadAction<Job>) {
      state.jobs.unshift(action.payload)
    },
    updateJobStatus(state, action: PayloadAction<{ id: string; status: JobStatus }>) {
      const job = state.jobs.find(j => j.id === action.payload.id)
      if (job) job.status = action.payload.status
    },
    releaseJobEscrow(state, action: PayloadAction<string>) {
      const job = state.jobs.find(j => j.id === action.payload)
      if (job) job.escrowStatus = 'released'
    },
  },
})

export const { setJobs, addJob, updateJobStatus, releaseJobEscrow } = jobsSlice.actions
export default jobsSlice.reducer
