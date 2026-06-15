import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: string;
  phone: string;
  dob: string;
  gender: string;
  location: string;
  userId: string;
}

export interface FullUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profileCompleted: boolean;
  profile: UserProfile | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: FullUser | null;
  profileCompleted: boolean;
  showProfileModal: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  profileCompleted: false,
  showProfileModal: false,
  loading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setFullUser: (state, action: PayloadAction<FullUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.profileCompleted = action.payload.profileCompleted;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profileCompleted = false;
      state.showProfileModal = false;
    },
    setProfileCompleted: (state, action: PayloadAction<boolean>) => {
      state.profileCompleted = action.payload;
    },
    setShowProfileModal: (state, action: PayloadAction<boolean>) => {
      state.showProfileModal = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
})

export const { setUser, setFullUser, logout, setProfileCompleted, setShowProfileModal, setInitialized } = authSlice.actions
export default authSlice.reducer
