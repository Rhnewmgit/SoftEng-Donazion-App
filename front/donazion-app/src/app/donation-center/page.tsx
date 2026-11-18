import Link from "next/link";
import styles from "@/app/page.module.css";

export default function DonationCenter() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Donation Center Login</h1>

        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Dashboard*/}

          <Link
            className={styles.primary} 
            href="/donation-center/dashboard">
            Login
          </Link>

          {/* NEXT BUTTON    Categories & Items*/}

          <Link
            className={styles.primary}
            href="/donation-center/dashboard">
            Register
          </Link>


        </div>

        <Link href="/">← back</Link>
      </main>
    </div>
  );
}