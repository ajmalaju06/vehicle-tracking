import { useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { AppDispatch, RootState } from "@/store/store";
import { setNumberPlateList, setVehicleDetails } from "@/store/slices/mapSlice";
import { socket_URL } from "@/utilities/Constance";
import { VehicleDataState } from "@/models/Vehicle.interface";

const emptyVehicleData: VehicleDataState = {
  lat: 0,
  lng: 0,
  angle: 0,
  speed: 0,
  status: "",
  timestamp: "",
};

export default function useMap() {
  const { vehicleDetails, numberPlateList, selectedPlate } = useSelector(
    (state: RootState) => state.map
  );

  const dispatch = useDispatch<AppDispatch>();

  const isConnected = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(socket_URL, {
      transports: ["websocket"],
    });
  }

  const socket = socketRef.current;

  /**
   * connectSocket is a function that initializes the WebSocket connection
   * and sets up event listeners for various socket events.
   * It listens for vehicle data, vehicles list, unsubscribed events, and errors.
   * @returns {boolean} - Returns true if the socket is successfully connected, false otherwise
   */
  const connectSocket = useCallback((): boolean => {
    if (!socket || isConnected.current) return false;

    isConnected.current = true;

    socket.on("connect", () => {
      console.log(`Connected with ID: ${socket.id}`);
    });

    socket.on("vehicleData", ({ plate, data }) => {
      if (data) {
        dispatch(setVehicleDetails(data));
        console.log(`Vehicle - ${plate} =>`, data);
      }
    });

    socket.on("vehiclesList", (data) => {
      console.log(`Vehicle -  =>`, data);
      dispatch(setNumberPlateList(data));
    });

    socket.on("unsubscribed", ({ plate }) => {
      console.log(`---- unsubscribed vehicle: ${plate} ----`);
    });

    socket.on("error", ({ message }) => {
      console.error(`Socket Error: ${message}`);
    });

    return true;
  }, [dispatch, socket]);

  /**
   * getVehicles is a function that emits a request to the server
   * to fetch the list of vehicles.
   */
  const getVehicles = useCallback(() => {
    if (!socket) return;
    socket.emit("getVehicles");
  }, [socket]);

  /**
   * subScribePlate is a function that subscribes to a specific vehicle's data
   * This function is typically called when a user selects a vehicle to view its details.
   * @param {string} plate - The vehicle's plate number to subscribe to
   */
  const subScribePlate = useCallback(
    (plate: string) => {
      if (!socket) return;
      socket.emit("subscribeToVehicle", { plate });
    },
    [socket]
  );

  /**
   * unSubscribePlate is a function that unsubscribes from a specific vehicle's data
   * by emitting an unsubscription request to the server with the vehicle's plate number.
   * It checks if the socket is initialized before emitting the event.
   */
  const unSubscribePlate = useCallback(
    (plate: string) => {
      if (!socket) return;
      socket.emit("unsubscribeFromVehicle", { plate });
    },
    [socket]
  );

  /**
   * lastLocation is a memoized value that retrieves the last known location
   * of the vehicle from the vehicleDetails array.
   */
  const lastLocation: VehicleDataState = useMemo(() => {
    return (
      (vehicleDetails.length > 0 &&
        vehicleDetails[vehicleDetails.length - 1]) ||
      emptyVehicleData
    );
  }, [vehicleDetails]);

  return {
    vehicleDetails,
    numberPlateList,
    connectSocket,
    subScribePlate,
    unSubscribePlate,
    getVehicles,
    lastLocation,
    selectedPlate,
  };
}
