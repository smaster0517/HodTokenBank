import { NavLink } from "react-router-dom";
import "./NavbarMenu.css";

export default function NavbarMenu() {
  return (
    <>
      <div className="navbar">
        <nav>
          <NavLink to="/" className="brand">
            <h1>Yom Bank</h1>
          </NavLink>

          <NavLink to="/">Home</NavLink>
          <NavLink to="/deposit">Deposit</NavLink>
          <NavLink to="/withdraw">Withdraw</NavLink>
        </nav>
      </div>
    </>
  );
}
