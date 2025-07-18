import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeState } from '../../types';


const getInitialTheme = (): boolean => {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme !== null) {
    return savedTheme === 'true';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initialState: ThemeState = {
  darkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', String(state.darkMode));
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;