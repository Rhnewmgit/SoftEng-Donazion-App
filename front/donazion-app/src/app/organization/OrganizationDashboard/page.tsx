import Link from "next/link";
import styles from "@/app/page.module.css";

export default function OrganizationDashboard() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Dashboard*/}

          <Link
            className={styles.secondary} 
            href="/organization/OrganizationDashboard">
            Dashboard
          </Link>

          {/* NEXT BUTTON    Categories & Items*/}

          <Link
            className={styles.primary}
            href="/organization/Categories">
            Categories & Items
          </Link>

          {/* NEXT BUTTON    Donation Centers */}

          <Link
            className={styles.primary}
            href="/organization/DonationCenter">
            Donation Centers
          </Link>

          {/* NEXT BUTTON    Change Password */}

          <Link
            className={styles.primary}
            href="/organization/ChangePassword">
            Change Password
          </Link>

        </div>

        <h1>Organization Dashboard</h1>

        <Link href="/">← Log Out</Link>
      </main>
    </div>
  );
}