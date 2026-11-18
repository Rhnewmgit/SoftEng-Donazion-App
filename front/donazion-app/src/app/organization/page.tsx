import Link from "next/link";
import styles from "@/app/page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Login</h1>

        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Dashboard*/}

          <Link
            className={styles.primary} 
            href="/organization/OrganizationDashboard">
            Login
          </Link>

          {/* NEXT BUTTON    Catagories & Items*/}

          <a
            className={styles.primary}
            href="/organization/OrganizationDashboard">
            Register
          </a>


        </div>

        <Link href="/">← back</Link>
      </main>
    </div>
  );
}