import { ROUTES } from "@/routes/routes";
import React from "react";

const Error = () => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "20px",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    maxWidth: "400px",
    width: "100%",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "35px",
    width: "80px",
    height: "80px",
    marginBottom: "20px",
    display: "inline-block",
    padding: "15px",
    borderRadius: "50%",
    backgroundColor: "#fee2e2",
    color: "#ef4444",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "24px",
    padding: "12px 24px",
    backgroundColor: "#475569",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    transition: "background-color 0.2s",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>!</div>
        <h1
          style={{ color: "#1e293b", fontSize: "24px", margin: "0 0 10px 0" }}
        >
          Oops! Something went wrong
        </h1>
        <p style={{ color: "#64748b", lineHeight: "1.5", margin: 0 }}>
          We apologize, but there was an unexpected error. Please try refreshing
          the page or going back.
        </p>
        <button
          style={buttonStyle}
          onClick={() => (window.location.href = ROUTES.HOME)}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#334155")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#475569")
          }
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Error;
