import React from "react";
import Login from "./login";
import "../scss/components/topbar.scss";

export function TopBar() {
  return <nav>
    <div className="container">
      <h2 className="logo"><span>JS</span> Workbench</h2>
      <div className="btnContainer">
        <button className="fork-button">fork</button>
        <Login />
      </div>
    </div>
  </nav>
}