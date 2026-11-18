import Link from "next/link";
import styles from "@/app/page.module.css";

export default function DonorDashboard() {
  return (
   <div className={styles.page}>
      <main className={styles.main}>

        <h1>Donor Dashboard</h1>

        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Donation Box*/}

          <Link
            className={styles.primary} 
            href="/donor/box">
            Prepare Donation Box
          </Link>


        </div>

        <Link href="/">← back</Link>
      </main>
    </div>
  );
}