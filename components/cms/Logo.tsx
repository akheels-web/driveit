import React from 'react'

export const Logo = () => {
  return (
    <div className="driveit-brand-root">
      {/* ─────────────────────────────────────────────────────────────
          1. COMPACT LOGO (Displayed in Sidebar Navigation when logged in)
          ───────────────────────────────────────────────────────────── */}
      <div className="driveit-nav-logo">
        <div className="driveit-nav-crest">
          <span>D</span>
        </div>
        <div className="driveit-nav-text">
          <span className="driveit-nav-title">DriveIt</span>
          <span className="driveit-nav-subtitle">Executive Console</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EXECUTIVE ATELIER SHOWCASE (Left Section of Admin Login)
          ───────────────────────────────────────────────────────────── */}
      <div className="driveit-login-showcase">
        {/* Top: Brand Monogram & System Status */}
        <div className="driveit-showcase-top">
          <div className="driveit-showcase-crest-wrap">
            <div className="driveit-showcase-crest">
              <span>D</span>
            </div>
            <div className="driveit-showcase-titles">
              <span className="driveit-showcase-brand">DRIVEIT <em>LUXURY</em></span>
              <span className="driveit-showcase-tag">Operations & Fleet Command</span>
            </div>
          </div>

          <div className="driveit-showcase-status-badge">
            <span className="driveit-status-dot" />
            <span className="driveit-status-label">Operations Console • Active</span>
          </div>
        </div>

        {/* Center: Executive Operations Overview */}
        <div className="driveit-showcase-center">
          <div className="driveit-showcase-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Internal Operations Portal
          </div>

          <h1 className="driveit-showcase-heading">
            Fleet Operations & <br />
            <span className="driveit-gold-gradient-text">Executive Operations.</span>
          </h1>

          <p className="driveit-showcase-desc">
            Centralized executive console for vehicle inventory, chauffeur & self-drive rate management, reservations, concierge dispatch, and customer verification.
          </p>

          {/* 3 Executive Operations Cards */}
          <div className="driveit-showcase-features">
            <div className="driveit-showcase-feat-card">
              <div className="driveit-feat-icon feat-icon-gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div>
                <h4 className="driveit-feat-title">Fleet & Pricing Management</h4>
                <p className="driveit-feat-subtitle">Configure 50+ vehicles, chauffeur rates, self-drive pricing, and deposits.</p>
              </div>
            </div>

            <div className="driveit-showcase-feat-card">
              <div className="driveit-feat-icon feat-icon-emerald">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4 className="driveit-feat-title">Reservations & Live Holds</h4>
                <p className="driveit-feat-subtitle">Monitor live calendar availability, real-time reservations, and vehicle allocation.</p>
              </div>
            </div>

            <div className="driveit-showcase-feat-card">
              <div className="driveit-feat-icon feat-icon-blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <h4 className="driveit-feat-title">Invoicing & KYC Verification</h4>
                <p className="driveit-feat-subtitle">Review driving licenses, verify payment UTRs, and dispatch GST invoices.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Internal Terminal Footer */}
        <div className="driveit-showcase-footer">
          <div className="driveit-footer-stat">
            <span className="driveit-footer-stat-value">50+</span>
            <span className="driveit-footer-stat-label">Fleet Units</span>
          </div>
          <div className="driveit-footer-stat-sep" />
          <div className="driveit-footer-stat">
            <span className="driveit-footer-stat-value">24/7</span>
            <span className="driveit-footer-stat-label">Concierge Dispatch</span>
          </div>
          <div className="driveit-footer-stat-sep" />
          <div className="driveit-footer-stat">
            <span className="driveit-footer-stat-value">100%</span>
            <span className="driveit-footer-stat-label">Verified Operations</span>
          </div>
        </div>
      </div>
    </div>
  )
}
