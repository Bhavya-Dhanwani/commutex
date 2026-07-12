"use client";

import styles from "../styles/DashboardPage.module.css";
import EmptyState from "./EmptyState";

export default function RecentTrips({ trips = [], isEmpty = false, onCreateTrip }) {
  const dummyTrips = [
    { id: "TX-9041", vehicle: "Volvo FH16 (H-4321)", driver: "Rahul S.", status: "In Progress" },
    { id: "TX-9040", vehicle: "Tata Prima (H-2204)", driver: "Suresh P.", status: "Completed" },
    { id: "TX-9039", vehicle: "Mahindra Blazo (H-8910)", driver: "Amit K.", status: "Completed" },
    { id: "TX-9038", vehicle: "Eicher Pro (H-7765)", driver: "Vikram R.", status: "Pending" },
    { id: "TX-9037", vehicle: "Ashok Leyland (H-3011)", driver: "Arjun M.", status: "In Progress" },
  ];

  const activeTrips = isEmpty ? [] : trips.length > 0 ? trips : dummyTrips;

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return styles.statusSuccess;
      case "Pending":
        return styles.statusWarning;
      case "In Progress":
      default:
        return styles.statusInfo;
    }
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Recent Trips</h3>
      </div>
      {activeTrips.length === 0 ? (
        <EmptyState
          title="No Trips Today"
          description="There are no dispatch trips scheduled for today yet. Start by creating one."
          actionText="Create Trip"
          onAction={onCreateTrip}
        />
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeTrips.map((trip) => (
                <tr key={trip.id}>
                  <td style={{ fontWeight: 600 }}>{trip.id}</td>
                  <td>{trip.vehicle}</td>
                  <td>{trip.driver}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
