import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/MapNavigation";
import SmartTripPlanner from "./pages/SmartTripPlanner";

function App() {
  return (
    <Router>
      <Routes>
        {/* KHÔNG DÙNG FRAGMENT (<>...</>) Ở ĐÂY */}
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/lich-trinh" element={<SmartTripPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;