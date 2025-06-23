import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: 'admin' | 'vendor' | 'customer' | null;
  id: string | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  id: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; role: string; id: string }>) {
      state.token = action.payload.token;
      state.role = action.payload.role as 'admin' | 'vendor' | 'customer';
      state.id = action.payload.id;
      localStorage.setItem('userId', action.payload.id);
    },
    clearCredentials(state) {
      state.token = null;
      state.role = null;
      state.id = null;
      localStorage.removeItem('userId');
    },
  },
});


export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
