import { AppDispatch, RootState } from "@/store/store";
import { FaCar } from "react-icons/fa";
import { PiCarProfileFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { setIsLeftPanelOpen } from "@/store/slices/uiSlice";
import useMap from "@/hooks/useMap";
import { IoMenu } from "react-icons/io5";
import { setSelectedPlate } from "@/store/slices/mapSlice";
import styles from "@/css/LeftPanel.module.scss";

const LeftPanel = () => {
  const { isLeftPanelOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();

  // Accessing the map-related state and functions from the useMap hook
  const { subScribePlate, unSubscribePlate, numberPlateList, selectedPlate } =
    useMap();

  return (
    <div
      className={`${styles.leftPanel} ${isLeftPanelOpen ? styles.open : styles.closed}`}
    >
      <FaCircleChevronLeft
        className={`${styles.chevron} ${isLeftPanelOpen ? styles.show : styles.hide}`}
        onClick={() => {
          dispatch(setIsLeftPanelOpen(false));
        }}
      />

      <div
        className={`${styles.menuBtn} ${isLeftPanelOpen ? styles.hide : styles.show}`}
        onClick={() => dispatch(setIsLeftPanelOpen(true))}
      >
        <IoMenu className="text-black" />
      </div>

      {isLeftPanelOpen && (
        <>
          <div className={styles.carsHeader}>
            <PiCarProfileFill style={{ color: "#fff", fontSize: "2rem" }} />
            <span>Cars</span>
          </div>

          <div className={styles.plateList}>
            {numberPlateList.map((item, index) => {
              const isSelected = selectedPlate === item;
              return (
                <div
                  key={item + index}
                  className={`${styles.plateItem} ${isSelected ? styles.selected : ""}`}
                  onClick={() => {
                    unSubscribePlate(selectedPlate);
                    subScribePlate(item);
                    dispatch(setSelectedPlate(item));
                  }}
                >
                  <FaCar
                    className={`${styles.plateIcon} ${isSelected ? styles.selected : ""}`}
                  />
                  <span
                    className={`${styles.plateText} ${isSelected ? styles.selected : ""}`}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
