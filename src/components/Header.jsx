import { useState, useEffect } from "react";
import patrick from '../../public/image/patrick.jpg';

// components/Header.js

const Header = () => {
  const [connectionStatus, setConnectionStatus] = useState("good");

  const updateConnectionStatus = () => {
    if (!navigator.onLine) {
      setConnectionStatus("bad");
    } else if (navigator.connection) {
      const { downlink } = navigator.connection;
      if (downlink >= 2) {
        setConnectionStatus("good"); // Koneksi bagus
      } else if (downlink >= 0.5 && downlink < 2) {
        setConnectionStatus("average"); // Koneksi biasa saja
      } else {
        setConnectionStatus("bad"); // Koneksi buruk
      }
    }
  };

  useEffect(() => {
    updateConnectionStatus(); // Mengecek status koneksi saat komponen di-mount
    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);
    if (navigator.connection) {
      navigator.connection.addEventListener("change", updateConnectionStatus);
    }

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
      if (navigator.connection) {
        navigator.connection.removeEventListener("change", updateConnectionStatus);
      }
    };
  }, []);

  const getBallColor = () => {
    switch (connectionStatus) {
      case "good":
        return "bg-green-400";
      case "average":
        return "bg-yellow-400";
      case "bad":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="navbar bg-green-700 text-white">
      <div className="navbar-start">
        <label htmlFor="my-drawer" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Sehatea Apps</a>
        <div className={`w-3 h-3 rounded-full ${getBallColor()}`}></div>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={patrick}
                alt="Profile"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
