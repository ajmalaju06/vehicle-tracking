import { useEffect, useCallback } from "react";
import useMap from "./hooks/useMap";
import MapPanel from "./components/mapPanel/MapPanel";
import LeftPanel from "./components/leftPanel/LeftPanel";
import styles from "@/css/App.module.scss";

export default function App() {
  const { connectSocket, subScribePlate, getVehicles, selectedPlate } =
    useMap();

  /**
   * handleSocketConnection is a callback that connects to the WebSocket server,
   * subscribes to the selected vehicle's plate, and fetches the vehicle data.
   */
  const handleSocketConnection = useCallback(() => {
    const isConnected = connectSocket();
    if (isConnected) {
      subScribePlate(selectedPlate);
      getVehicles();
    }
  }, [connectSocket, subScribePlate]);

  /**
   * useEffect hook to handle the socket connection.
   * It calls handleSocketConnection when the component mounts.
   */
  useEffect(() => {
    handleSocketConnection();
  }, [handleSocketConnection]);

  return (
    <div className={styles.main_container}>
      <LeftPanel />
      <MapPanel />
    </div>
  );
}
