import Link from "next/link";
import styles from "@/app/page.module.css";

export default function DonationCenter() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Dashboard*/}

          <Link
            className={styles.primary} 
            href="/organization/OrganizationDashboard">
            Dashboard
          </Link>

          {/* NEXT BUTTON    Categories & Items */}

          <Link
            className={styles.primary}
            href="/organization/Categories">
            Categories & Items
          </Link>

          {/* NEXT BUTTON    Donation Center */}

          <Link
            className={styles.secondary}
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

        <h1>Donation Centers</h1>

        <Link href="/organization">← Log Out</Link>
      </main>
    </div>
  );
}