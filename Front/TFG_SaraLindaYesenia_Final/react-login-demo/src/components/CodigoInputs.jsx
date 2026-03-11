import { useState, useRef, useEffect } from "react";
import "./CodigoInputs.css";

export default function CodigoInputs({ value = "", onChange }) {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (value.length === 6) {
      const arr = value.split("");
      setValues(arr);
    }
  }, [value]);

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();

    if (!/^[0-9]{6}$/.test(paste)) return;

    const arr = paste.split("");
    setValues(arr);
    onChange(paste);

    // Enfocar la última casilla
    inputsRef.current[5].focus();
  };

  const handleChange = (val, index) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    onChange(newValues.join(""));

    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="codigo-inputs">
      {values.map((v, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          value={v}
          ref={(el) => (inputsRef.current[i] = el)}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}