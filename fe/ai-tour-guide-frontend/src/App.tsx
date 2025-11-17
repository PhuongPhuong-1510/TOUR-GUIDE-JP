import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/MapNavigation";
import SmartTripPlanner from "./pages/SmartTripPlanner";
import PlannerView from "./pages/PlannerView"; // <--- 1. THÊM IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/lich-trinh" element={<SmartTripPlanner />} />
        
        {/* 2. THÊM ROUTE CHI TIẾT VÀO ĐÂY */}
        <Route path="/planner-details" element={<PlannerView />} />

      </Routes>
    </Router>
  );
}

export default App;