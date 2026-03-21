import { useState } from "react";
import styles from "./HillVisualizer.module.css";

export default function HillKeyInput({ keyStr, onChange }) {
  const currentArr = Array.isArray(keyStr) 
    ? keyStr.flat() 
    : String(keyStr).split(/[\s,]+/).filter(x => x !== "");
  
  const initialSize = currentArr.length > 4 ? 3 : 2;
  const [size, setSize] = useState(initialSize);
  
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    if (newSize === 2) onChange("9,4,5,7");
    if (newSize === 3) onChange("6,24,1,13,16,10,20,17,15");
  }

  const updateMatrix = (idx, val) => {
    let raw = Array.isArray(keyStr) ? keyStr.flat() : String(keyStr).split(/[\s,]+/).filter(x => x !== "");
    const safeStr = [];
    for(let i=0; i < size * size; i++) {
        safeStr.push(raw[i] || "0");
    }
    safeStr[idx] = val;
    onChange(safeStr.join(","));
  }

  const cells = [];
  for(let i=0; i < size * size; i++) cells.push(currentArr[i] || "0");

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputHeader}>
        <span className={styles.inputLabel}>Hill Matrix Base Size:</span>
        <div className={styles.toggleGroup}>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${size === 2 ? styles.activeBtn : ""}`} 
            onClick={() => handleSizeChange(2)}
          >2×2</button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${size === 3 ? styles.activeBtn : ""}`} 
            onClick={() => handleSizeChange(3)}
          >3×3</button>
        </div>
      </div>
      <div className={styles.matrixGridMain} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {cells.map((val, idx) => (
          <input 
            key={idx} 
            type="number" 
            className={styles.matrixCellInput} 
            value={val} 
            onChange={(e) => updateMatrix(idx, e.target.value)} 
          />
        ))}
      </div>
      <p className={styles.inputHint}>Enter numerical values (0-25) directly into the grid structure.</p>
    </div>
  );
}
