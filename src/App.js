import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Withdraw from "./pages/Withdraw";
import NavbarMenu from "./components/NavbarManu";
import Deposit from "./pages/Deposit";
import { init } from "../src/components/Web3Client";
import OwnerUpdate from "./pages/admin/OwnerUpdate";

let isInitiallized = false;
const start = async () => {
  if (!isInitiallized) {
    return await init();
  }
};
function App() {
  start();

  return (
    <div className="App">
      <BrowserRouter>
        <NavbarMenu />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/deposit" element={<Deposit />} />
          <Route exact path="/withdraw" element={<Withdraw />} />
          <Route exact path="/admin" element={<OwnerUpdate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
