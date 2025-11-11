// Định nghĩa GeoapifyFeature nên được import từ service/geocodeService
// Nhưng để code chạy, ta định nghĩa lại tạm ở đây.
// *LƯU Ý: Nếu GeoapifyFeature đã có trong geocodeService.ts, hãy xóa định nghĩa này.
export interface GeoapifyFeature {
  formatted: string;
  lon: number;
  lat: number;
  // Thêm các trường khác cần thiết của feature
}

export interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (feature: GeoapifyFeature) => void;
  placeholder?: string;
  disabled?: boolean;
  locked?: boolean;
  className?: string;
  showSearchButton?: boolean;
}

// Props cho Custom Hook (Chứa tất cả logic cần thiết)
export interface UseAutocompleteLogicProps {
  value: string;
  locked?: boolean;
  onSelect: (feature: GeoapifyFeature) => void;
  setHasSelected: (selected: boolean) => void; // Thêm prop này để logic hook gọi
}

// Props cho AutocompletePopup
export interface AutocompletePopupProps {
  suggestions: GeoapifyFeature[];
  handleSelect: (feature: GeoapifyFeature) => void;
  coords: { top: number; left: number; width: number };
}