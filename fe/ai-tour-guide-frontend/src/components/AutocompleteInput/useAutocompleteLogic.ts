import { useState, useEffect, useRef, useCallback } from "react";
import { GeoapifyFeature, autocompleteGeoapify } from "../../services/geocodeService";
import { UseAutocompleteLogicProps } from "./types";

export const useAutocompleteLogic = ({
  value,
  locked,
  onSelect,
  setHasSelected,
}: UseAutocompleteLogicProps) => {
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const didMountRef = useRef(false);
  const fetchingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  // === Cập nhật tọa độ cho Portal ===
  const updateCoords = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const newCoords = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      };
      setCoords(newCoords);
      // LOG 1: Kiểm tra tọa độ Portal
      console.log("➡️ LOG (Coords): Tọa độ Popup", newCoords); 
    } else {
      console.log("⚠️ LOG (Coords): inputRef chưa được gán.");
    }
  }, []);

  // Cập nhật tọa độ khi scroll/resize
  useEffect(() => {
    updateCoords();
    window.addEventListener("scroll", updateCoords);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords);
      window.removeEventListener("resize", updateCoords);
    };
  }, [updateCoords]);

  // === Logic gọi API autocomplete ===
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // LOG 2: Kiểm tra giá trị input và trạng thái khóa
    console.log(`🔎 LOG (API): Value: "${value}", Locked: ${locked}`);

    // Dừng gọi API nếu không có giá trị, bị khóa
    if (!value || locked) {
      setSuggestions([]);
      setLoading(false);
      console.log("🛑 LOG (API): Dừng gọi API (Không có Value hoặc Locked).");
      return;
    }
    
    setLoading(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    debounceRef.current = setTimeout(async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      console.log(`📡 LOG (API): Bắt đầu gọi API cho "${value}"`);

      try {
        const results = await autocompleteGeoapify(value, signal);
        setSuggestions(results);
        // LOG 3: Kiểm tra kết quả API
        console.log("✅ LOG (API): Kết quả trả về:", results);
      } catch (e: any) {
        if (e.name !== "AbortError") console.error("Autocomplete Abort/Error", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
        updateCoords();
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      controller.abort();
      console.log(`✖️ LOG (API): Hủy gọi API cũ cho "${value}"`);
    };
  }, [value, locked, updateCoords]);

  // === Xử lý click chọn gợi ý ===
  // useAutocompleteLogic.ts (Hoặc phần handleSelect trong file lớn)

  // Hàm xử lý click chọn gợi ý
  const handleSelect = (feature: GeoapifyFeature) => {
    // Hủy fetch nếu đang fetch
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
      
    setHasSelected(true); // <-- Đánh dấu đã chọn
    setSuggestions([]); // <-- ĐẢM BẢO XÓA GỢI Ý NGAY LẬP TỨC
    fetchingRef.current = false;
    setLoading(false);

    onSelect(feature); // Hàm này thay đổi giá trị input (value)
  };

  return {
    suggestions,
    loading,
    coords,
    inputRef,
    handleSelect,
  };
};