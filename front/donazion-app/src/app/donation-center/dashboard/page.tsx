import Link from "next/link";
import styles from "@/app/page.module.css";

export default function DonationCenterDashboard() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Donation Center Dashboard</h1>

        <Link href="/donation-center">← Log Out</Link>
      </main>
    </div>
  );
}