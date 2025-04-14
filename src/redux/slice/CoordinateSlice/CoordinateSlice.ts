import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Coordinate {
  latitude: string;
  longitude: string;
}

interface CoordinateState {
  originCoords: Coordinate;
  destinationCoords: Coordinate;
  isLoading: boolean;
  initialGeocodeDone: boolean; // Thêm trường mới
}

const initialState: CoordinateState = {
  originCoords: {latitude: '', longitude: ''},
  destinationCoords: {latitude: '', longitude: ''},
  isLoading: false,
  initialGeocodeDone: false, // Khởi tạo giá trị
};

const coordinateSlice = createSlice({
  name: 'coordinate',
  initialState,
  reducers: {
    setOriginCoords: (state, action: PayloadAction<Coordinate>) => {
      state.originCoords = action.payload;
    },
    setDestinationCoords: (state, action: PayloadAction<Coordinate>) => {
      state.destinationCoords = action.payload;
    },
    setCoordinatesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialGeocodeDone: (state, action: PayloadAction<boolean>) => {
      state.initialGeocodeDone = action.payload;
    },
  },
});

export const {
  setOriginCoords,
  setDestinationCoords,
  setCoordinatesLoading,
  setInitialGeocodeDone, // Export action
} = coordinateSlice.actions;

export default coordinateSlice.reducer;
