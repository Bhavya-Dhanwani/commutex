"use client";

import Link from "next/link";
import {
  LuTruck,
  LuMapPinned,
  LuWrench,
  LuFuel,
  LuIndianRupee,
  LuShieldAlert,
  LuChartColumn,
  LuArrowRight,
  LuSettings,
  LuUsers
} from "react-icons/lu";

import styles from "../features/auth/ui/css/LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          commuteX
        </Link>
        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#analytics" className={styles.navLink}>Analytics</a>
          <a href="#about" className={styles.navLink}>Enterprise</a>
        </nav>
        <div className={styles.navButtons}>
          <Link href="/login" className={styles.btnOutline}>
            Login
          </Link>
          <Link href="/signup" className={styles.btnPrimary}>
            Start Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroTag}>Next-Gen Fleet Logistics</span>
          <h1 className={styles.heroTitle}>
            Intelligent Fleet operations.<br />Simplified.
          </h1>
          <p className={styles.heroDesc}>
            Optimize routes, track real-time dispatch workflows, schedule vehicle maintenance, monitor fuel efficiency, and secure operations using custom role-based dynamic permissions.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/signup" className={styles.btnPrimary} style={{ padding: "12px 28px", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Get Started Free <LuArrowRight size={16} />
            </Link>
            <a href="#features" className={styles.btnOutline} style={{ padding: "12px 28px", fontSize: "14px" }}>
              Explore Features
            </a>
          </div>
        </div>

        <div className={styles.heroRight}>
          {/* Glassmorphic Live Dashboard Preview Card */}
          <div className={styles.mockupCard}>
            <div className={styles.mockupHeader}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#111111" }}>live_fleet_monitor.log</span>
              <div className={styles.mockupDot}>
                <span className={styles.mockupDotItem} style={{ backgroundColor: "#ff5f56" }} />
                <span className={styles.mockupDotItem} style={{ backgroundColor: "#ffbd2e" }} />
                <span className={styles.mockupDotItem} style={{ backgroundColor: "#27c93f" }} />
              </div>
            </div>

            <div className={styles.mockupKpis}>
              <div className={styles.mockupKpiItem}>
                <div className={styles.mockupIcon}>
                  <LuTruck style={{ color: "#111111" }} />
                </div>
                <div className={styles.mockupKpiText}>
                  <span className={styles.mockupVal}>98.4%</span>
                  <span className={styles.mockupLbl}>Utilization</span>
                </div>
              </div>

              <div className={styles.mockupKpiItem}>
                <div className={styles.mockupIcon}>
                  <LuMapPinned style={{ color: "#111111" }} />
                </div>
                <div className={styles.mockupKpiText}>
                  <span className={styles.mockupVal}>14 active</span>
                  <span className={styles.mockupLbl}>Trips Online</span>
                </div>
              </div>
            </div>

            {/* Simulated Live SVG Line Graph for Fuel/Expenses */}
            <div className={styles.mockupChart}>
              <div style={{ position: "absolute", top: "12px", left: "16px", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#111111" }}>₹1.12L</span>
                <span style={{ fontSize: "9px", color: "#888888", fontWeight: 600, textTransform: "uppercase" }}>Operating Cost</span>
              </div>
              <svg viewBox="0 0 400 100" width="100%" height="80" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111111" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#111111" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 80 Q 80 20, 160 50 T 320 15 T 400 30 L 400 100 L 0 100 Z"
                  fill="url(#glowGrad)"
                />
                <path
                  d="M0 80 Q 80 20, 160 50 T 320 15 T 400 30"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="3"
                />
                <circle cx="320" cy="15" r="4" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Ribbon */}
      <section className={styles.metricsRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonNum}>12K+</span>
          <span className={styles.ribbonLbl}>Trips Dispatched</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonNum}>98.4%</span>
          <span className={styles.ribbonLbl}>Fleet Utilization</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonNum}>₹2.4M+</span>
          <span className={styles.ribbonLbl}>Expenses Saved</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonNum}>100%</span>
          <span className={styles.ribbonLbl}>Compliance Score</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.secHeader}>
          <h2 className={styles.secTitle}>Powerful features built for fleet managers</h2>
          <p className={styles.secDesc}>
            Manage vehicles, dispatch drivers, track operating fuel cost metrics, and optimize garage servicing schedules inside one central logistics suite.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {/* Card 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featIcon}>
              <LuTruck />
            </div>
            <h3 className={styles.featTitle}>Fleet Registry</h3>
            <p className={styles.featDesc}>
              Track vehicle parameters, active/retired states, odometer logs, and vehicle registration cards with real-time status bars.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featIcon}>
              <LuMapPinned />
            </div>
            <h3 className={styles.featTitle}>Trip Dispatch Manager</h3>
            <p className={styles.featDesc}>
              Dispatch draft trips, assign vehicles, confirm completion details, and track dynamic odometer adjustments in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featIcon}>
              <LuWrench />
            </div>
            <h3 className={styles.featTitle}>Maintenance Scheduling</h3>
            <p className={styles.featDesc}>
              Track active garage service sessions. Preventative logs automatically lock vehicle statuses to "In Shop" until complete.
            </p>
          </div>

          {/* Card 4 */}
          <div className={styles.featureCard}>
            <div className={styles.featIcon}>
              <LuSettings />
            </div>
            <h3 className={styles.featTitle}>Dynamic RBAC Control</h3>
            <p className={styles.featDesc}>
              Manage customizable role permissions catalogs. Turn feature access toggle controls on/off dynamically from Settings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to streamline your commute operations?</h2>
          <p className={styles.ctaDesc}>
            Join corporate logistics departments scaling fleet efficiencies, reducing idle vehicles, and optimizing operational billing logs.
          </p>
          <Link href="/signup" className={styles.ctaBtn}>
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>commuteX</span>
        <span className={styles.footerCopyright}>
          &copy; {new Date().getFullYear()} commuteX Platform. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
