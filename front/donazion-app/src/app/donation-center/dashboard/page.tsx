'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRequireDonLogin, logOutDon } from "@/lib/orgAuth";

export default function DonationCenterDashboard() {
  useRequireDonLogin();
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Donation Center Dashboard</h1>

        <Link href="/donation-center" onClick={logOutDon}>← Log Out</Link>
      </main>
    </div>
  );
}