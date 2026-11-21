import Link from "next/link";
import styles from "@/app/page.module.css";

export default function DonorBox() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Prepare Box</h1>

        <Link href="/donor">← Show Dashboard</Link>
      
      </main>
    </div>
  );
}