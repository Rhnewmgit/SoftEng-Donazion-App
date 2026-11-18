'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRequireOrgLogin, logOutOrg } from "@/lib/orgAuth";

export default function Categories() {
  useRequireOrgLogin();
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

          {/* NEXT BUTTON    Categories & Items*/}

          <Link
            className={styles.secondary}
            href="/organization/Categories">
            Categories & Items
          </Link>

          {/* NEXT BUTTON    Donation Center */}

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

        <h1>Categories and Items</h1>

        <Link href="/organization" onClick={logOutOrg}>← Log Out</Link>
      </main>
    </div>
  );
}