import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/MapNavigation";

function App() {
  return (
    <Router>
      <Routes>
        {/* KHÔNG DÙNG FRAGMENT (<>...</>) Ở ĐÂY */}
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;