import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, UserCircleIcon, PhoneIcon } from "@heroicons/react/24/solid";

export default function PendingSellersTable() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingSellers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/v1/admin/seller/pending",
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch sellers");
        }

        const data = await res.json();
        setSellers(data?.data?.sellersList ?? []);
      } catch (err) {
        setError(err.message || "Failed to fetch sellers");
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSellers();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

        .pst-wrapper * {
          box-sizing: border-box;
        }

        .pst-wrapper {
          font-family: 'Lato', sans-serif;
          background: #EEEEEE;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 16px;
        }

        .pst-card {
          width: 100%;
          max-width: 860px;
          background: #EEEEEE;
          border: 1.5px solid #8E1616;
          box-shadow: 6px 6px 0px #8E1616, 12px 12px 0px rgba(142,22,22,0.15);
          position: relative;
        }

        /* Decorative corner marks */
        .pst-card::before,
        .pst-card::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: #8E1616;
          border-style: solid;
        }
        .pst-card::before {
          top: -6px; left: -6px;
          border-width: 2px 0 0 2px;
        }
        .pst-card::after {
          bottom: -6px; right: -6px;
          border-width: 0 2px 2px 0;
        }

        .pst-header {
          padding: 36px 36px 24px;
          border-bottom: 1px solid rgba(142,22,22,0.3);
          position: relative;
        }

        .pst-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: #8E1616;
          letter-spacing: 0.02em;
          margin: 0 0 6px;
          line-height: 1;
        }

        .pst-subtitle {
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(29,22,22,0.55);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0;
        }

        /* Red rule accent under title */
        .pst-rule {
          display: block;
          width: 48px;
          height: 2px;
          background: #8E1616;
          margin: 12px 0 0;
        }

        /* Scrollable table container */
        .pst-body {
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pst-body::-webkit-scrollbar { display: none; }

        table.pst-table {
          width: 100%;
          min-width: 560px;
          border-collapse: collapse;
        }

        .pst-table thead tr th {
          padding: 12px 20px;
          border-bottom: 1.5px solid #8E1616;
          text-align: left;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(29,22,22,0.6);
        }

        .pst-table tbody tr {
          transition: background 0.15s ease;
          border-bottom: 1px solid rgba(142,22,22,0.18);
        }
        .pst-table tbody tr:last-child {
          border-bottom: none;
        }
        .pst-table tbody tr:hover {
          background: rgba(142,22,22,0.06);
        }

        .pst-table tbody td {
          padding: 16px 20px;
          vertical-align: middle;
        }

        .cell-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cell-name svg {
          width: 22px;
          height: 22px;
          color: rgba(29,22,22,0.45);
          flex-shrink: 0;
        }
        .cell-text {
          font-size: 0.875rem;
          color: #1D1616;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .cell-phone {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cell-phone svg {
          width: 14px;
          height: 14px;
          color: rgba(29,22,22,0.45);
          flex-shrink: 0;
        }
        .cell-phone .cell-text {
          color: rgba(29,22,22,0.75);
        }

        .cell-role {
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(29,22,22,0.55);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 10px;
          border: 1px solid rgba(216,64,64,0.4);
          background: rgba(216,64,64,0.07);
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #D84040;
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .status-label {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #D84040;
          font-weight: 700;
        }

        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: transparent;
          border: 1px solid rgba(29,22,22,0.25);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          position: relative;
        }
        .view-btn svg {
          width: 16px;
          height: 16px;
          color: #1D1616;
          transition: color 0.15s;
        }
        .view-btn:hover {
          background: #8E1616;
          border-color: #8E1616;
          transform: translateY(-1px);
        }
        .view-btn:hover svg {
          color: #EEEEEE;
        }

        /* State rows */
        .pst-state-row td {
          padding: 48px 20px;
          text-align: center;
        }
        .pst-state-text {
          font-size: 0.85rem;
          color: rgba(29,22,22,0.5);
          letter-spacing: 0.06em;
        }
        .pst-error-text {
          font-size: 0.85rem;
          color: #D84040;
          letter-spacing: 0.04em;
        }

        /* Loading skeleton shimmer */
        .pst-skeleton {
          display: inline-block;
          height: 14px;
          border-radius: 2px;
          background: linear-gradient(90deg, rgba(142,22,22,0.08) 25%, rgba(142,22,22,0.18) 50%, rgba(142,22,22,0.08) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .pst-footer {
          border-top: 1px solid rgba(142,22,22,0.3);
          padding: 14px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pst-footer-text {
          font-size: 0.75rem;
          color: rgba(29,22,22,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pst-count {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #8E1616;
        }
      `}</style>

      <div className="pst-wrapper">
        <div className="pst-card">
          {/* Header */}
          <div className="pst-header">
            <h1 className="pst-title">Pending Sellers</h1>
            <p className="pst-subtitle">
              Review and approve newly registered sellers
            </p>
            <span className="pst-rule" />
          </div>

          {/* Table */}
          <div className="pst-body">
            <table className="pst-table">
              <thead>
                <tr>
                  {["Name", "Phone Number", "Function", "Status", ""].map(
                    (h) => (
                      <th key={h}>{h}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="pst-state-row">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j}>
                          <span
                            className="pst-skeleton"
                            style={{
                              width:
                                j === 4 ? 34 : `${60 + Math.random() * 40}px`,
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr className="pst-state-row">
                    <td colSpan={5}>
                      <span className="pst-error-text">⚠ {error}</span>
                    </td>
                  </tr>
                ) : sellers.length === 0 ? (
                  <tr className="pst-state-row">
                    <td colSpan={5}>
                      <span className="pst-state-text">
                        No pending sellers at this time.
                      </span>
                    </td>
                  </tr>
                ) : (
                  sellers.map((seller) => (
                    <tr key={seller._id}>
                      {/* Name */}
                      <td>
                        <div className="cell-name">
                          <UserCircleIcon />
                          <span className="cell-text">{seller.name}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        <div className="cell-phone">
                          <PhoneIcon />
                          <span className="cell-text">
                            {seller.phone || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span className="cell-role">Seller</span>
                      </td>

                      {/* Status */}
                      <td>
                        <div className="status-badge">
                          <span className="status-dot" />
                          <span className="status-label">
                            {seller.verificationStatus || "Pending"}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          className="view-btn"
                          title="View Seller Info"
                          onClick={() =>
                            navigate(`/admindashboard/seller/${seller._id}`)
                          }
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="pst-footer">
            <span className="pst-footer-text">Awaiting approval</span>
            {!loading && !error && (
              <span className="pst-count">
                {sellers.length} seller{sellers.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
