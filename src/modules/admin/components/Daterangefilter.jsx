import { useState } from "react";
import { RANGE_PRESETS, getRangeForPreset, formatRangeLabel } from "../utils/dateRanges";

export default function DateRangeFilter({ activePreset, onChange }) {
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (key) => {
    if (key === "personalizado") {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    const { from, to } = getRangeForPreset(key);
    onChange({ preset: key, from, to });
  };

  const applyCustom = () => {
    if (!customFrom || !customTo) return;
    onChange({ preset: "personalizado", from: customFrom, to: customTo });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl shadow-lg px-4 py-3 mb-6">
      {RANGE_PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => handlePreset(p.key)}
          className={
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors " +
            (activePreset === p.key
              ? "bg-lightBlue-600 text-white"
              : "bg-blueGray-50 text-blueGray-500 hover:bg-blueGray-100")
          }
        >
          {p.label}
        </button>
      ))}

      {showCustom && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="border border-blueGray-200 rounded-lg text-xs px-2 py-1.5 text-blueGray-600"
          />
          <span className="text-blueGray-400 text-xs">a</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="border border-blueGray-200 rounded-lg text-xs px-2 py-1.5 text-blueGray-600"
          />
          <button
            onClick={applyCustom}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}