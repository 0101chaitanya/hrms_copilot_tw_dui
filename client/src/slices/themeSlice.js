import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('colorScheme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState = {
  colorScheme: getInitialTheme(),
};

// Apply initial theme using data-theme attribute for DaisyUI v5 (only in browser)
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', initialState.colorScheme);
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleColorScheme: (state) => {
      state.colorScheme = state.colorScheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorScheme', state.colorScheme);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', state.colorScheme);
      }
    },
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload;
      localStorage.setItem('colorScheme', action.payload);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
  },
});

export const { toggleColorScheme, setColorScheme } = themeSlice.actions;
export default themeSlice.reducer;
