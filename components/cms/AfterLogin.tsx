import React from 'react'

export const AfterLogin = () => {
  return (
    <div className="driveit-after-login">
      {/* Security & Access Notice */}
      <div className="driveit-admin-security-card">
        <div className="driveit-security-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="driveit-shield-icon">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="driveit-security-title">Restricted Admin Access</span>
        </div>
        <p className="driveit-security-text">
          This portal is strictly for authorized DRIVEIT administrators, fleet managers, and dispatch operations. All access attempts are logged.
        </p>
      </div>

      {/* Navigation & Help Links */}
      <div className="driveit-admin-nav-links">
        <a href="/" className="driveit-admin-back-link">
          ← Return to Main Website
        </a>
        <span className="driveit-dot-divider">•</span>
        <a href="/login" className="driveit-admin-customer-link">
          Customer Portal
        </a>
      </div>

      {/* Staff Concierge Support */}
      <div className="driveit-admin-support-row">
        <span className="driveit-admin-support-label">Need staff credentials?</span>
        <a
          href="https://wa.me/916300041186?text=Hi%20DRIVEIT%20Concierge,%20I%20am%20a%20team%20member%20requesting%20staff%20portal%20access"
          target="_blank"
          rel="noopener noreferrer"
          className="driveit-admin-wa-link"
        >
          Contact Super Admin
        </a>
      </div>
    </div>
  )
}
