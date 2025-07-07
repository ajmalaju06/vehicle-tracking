import  {
  useState,
  useEffect,
  ComponentType,
  useCallback,
  useMemo,
} from "react";
import useMap from "@/hooks/useMap";
import { FaTachometerAlt } from "react-icons/fa";
import Lib from "@/utilities/lib";
import { debounce } from "lodash";
import { PiCarProfileFill } from "react-icons/pi";
import styles from "@/css/VehicleDetails.module.scss";

const VehicleDetails = () => {
  const { vehicleDetails, lastLocation } = useMap();

  // Average speed
  const avgSpeed = useMemo(() => {
    return Lib.getAverageSpeed(vehicleDetails);
  }, [vehicleDetails]);

  // Trip mileage
  const tripMileage = useMemo(() => {
    return Lib.getTripMileage(vehicleDetails);
  }, [vehicleDetails]);

  // Debounced address lookup
  const [locationDetails, setLocationDetails] = useState("");

  /**
   * useEffect hook to fetch address details based on the last known location.
   * It uses a debounce function to limit the frequency of API calls.
   */
  useEffect(() => {
    if (!lastLocation?.lat || !lastLocation?.lng) return;
    const debounced = debounce(async () => {
      const address = await Lib.getAddressFromLatLng(
        lastLocation.lat,
        lastLocation.lng
      );
      setLocationDetails(address);
    }, 500);
    debounced();
    return () => {
      debounced.cancel();
    };
  }, [lastLocation]);

  const VehicleStatus = useCallback(
    ({
      Icon,
      name,
      value,
      status = "",
    }: {
      value: number | string;
      name: string;
      Icon: ComponentType<{ className?: string }>;
      status?: string;
    }) => {
      let statusClass = styles["status-default"];
      switch (status) {
        case "moving":
          statusClass = styles["status-moving"];
          break;
        case "stopped":
          statusClass = styles["status-stopped"];
          break;
        case "idle":
          statusClass = styles["status-idle"];
          break;
        default:
          statusClass = styles["status-default"];
          break;
      }

      return (
        <div className={styles.vehicleStatus}>
          <span className={styles.statusLabel}>{name}</span>
          <div className={`${styles.statusValue} ${statusClass}`}>
            {<Icon className={statusClass} />}
            <span className={statusClass}>{value}</span>
          </div>
        </div>
      );
    },
    [lastLocation.status]
  );

  return (
    <div className={styles.vehicleDetails}>
      <span className={styles.locationLabel}>Last location</span>
      <span className={styles.locationDetails}>{locationDetails}</span>

      <div className={styles.statusRow}>
        <VehicleStatus Icon={FaTachometerAlt} name="Speed" value={avgSpeed} />

        <VehicleStatus
          Icon={PiCarProfileFill}
          name="Status"
          value={lastLocation.status}
          status={lastLocation.status}
        />

        <VehicleStatus
          Icon={FaTachometerAlt}
          name="Milage"
          value={tripMileage}
        />
      </div>
    </div>
  );
};

export default VehicleDetails;
