import { VehicleDataState } from "@/models/Vehicle.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSliceState {
  vehicleDetails: VehicleDataState[];
  numberPlateList: string[];
  selectedPlate: string;
}

const initialState: MapSliceState = {
  vehicleDetails: [],
  numberPlateList: [],
  selectedPlate: "DXB-CX-36357",
};

export const mapSlice = createSlice({
  name: "mapSlice",
  initialState,
  reducers: {
    setVehicleDetails: (state, action: PayloadAction<VehicleDataState>) => {
      state.vehicleDetails = [...state.vehicleDetails, action.payload];
    },
    setNumberPlateList: (state, action: PayloadAction<string[]>) => {
      state.numberPlateList = action.payload;
    },
    setSelectedPlate: (state, action: PayloadAction<string>) => {
      state.selectedPlate = action.payload;
    },
  },
});

// Export actions
export const { setVehicleDetails, setNumberPlateList, setSelectedPlate } =
  mapSlice.actions;

// Export reducer
export default mapSlice.reducer;
