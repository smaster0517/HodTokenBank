import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Withdraw from "./pages/Withdraw";
import NavbarMenu from "./components/NavbarManu";
import Deposit from "./pages/Deposit";
import { init } from "../src/components/Web3Client";

let isInitiallized = false;

function App() {
  if (!isInitiallized) {
    init();
  }
  return (
    <div className="App">
      <BrowserRouter>
        <NavbarMenu />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/deposit" element={<Deposit />} />
          <Route exact path="/withdraw" element={<Withdraw />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
