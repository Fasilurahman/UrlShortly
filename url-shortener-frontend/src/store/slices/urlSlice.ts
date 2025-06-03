import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UrlItem, UrlState } from '../../types/index';


const initialState: UrlState = {
  urls: [],
  loading: false,
  error: null,
};

const urlSlice = createSlice({
  name: 'urls',
  initialState,
  reducers: {
    fetchUrlsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUrlsSuccess: (state, action: PayloadAction<UrlItem[]>) => {
      state.urls = action.payload;
      state.loading = false;
    },
    fetchUrlsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUrlStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addUrlSuccess: (state, action: PayloadAction<UrlItem>) => {
      state.urls.unshift(action.payload);
      state.loading = false;
    },
    addUrlFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUrl: (state, action: PayloadAction<string>) => {
      state.urls = state.urls.filter((url) => url.id !== action.payload);
    },
    incrementUrlClicks: (state, action: PayloadAction<string>) => {
      const url = state.urls.find((url) => url.id === action.payload);
      if (url) {
        url.clicks += 1;
      }
    },
  },
});

export const {
  fetchUrlsStart,
  fetchUrlsSuccess,
  fetchUrlsFailure,
  addUrlStart,
  addUrlSuccess,
  addUrlFailure,
  deleteUrl,
  incrementUrlClicks,
} = urlSlice.actions;

export default urlSlice.reducer;