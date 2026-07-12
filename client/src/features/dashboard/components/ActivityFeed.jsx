"use client";

import styles from "../styles/DashboardPage.module.css";

export default function ActivityFeed({ activities }) {
  const defaultActivities = [
    { time: "09:20 AM", text: "Vehicle Volvo FH16 added to Fleet" },
    { time: "10:12 AM", text: "Trip TX-9040 marked as Completed" },
    { time: "10:55 AM", text: "Driver Vikram R. assigned to Trip TX-9038" },
    { time: "11:30 AM", text: "Maintenance scheduled for Tata Prima" },
    { time: "12:15 PM", text: "Fuel log entry logged for Mahindra Blazo" },
  ];

  const list = activities || defaultActivities;

  return (
    <div className={styles.activityFeed}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Recent Activity</h3>
      </div>
      <div className={styles.activityList}>
        {list.map((item, idx) => (
          <div key={idx} className={styles.activityItem}>
            <div className={styles.activityMarker} />
            <span className={styles.activityTime}>{item.time}</span>
            <p className={styles.activityText}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
