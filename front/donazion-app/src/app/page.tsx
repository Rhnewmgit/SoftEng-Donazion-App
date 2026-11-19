import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />                LATER WE CAN ADD LOGO HERE*/}


        <div className={styles.intro}>
          <h1>
            DONATION{" "}
          </h1>



          <p>
            login / register{" "}
          </p> 


        </div>



        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Dashboard*/}

          <Link
            className={styles.primary} 
            href="/donor">
            Doner Dashboard
          </Link>

           {/* NEXT BUTTON    Organization     was      styles.secondary*/}

          <Link
            className={styles.primary}
            href="/organization">
            Organization
          </Link>

          {/* NEXT BUTTON    Donation Center */}

          <Link
            className={styles.primary}
            href="/donation-center">
            Donation Center
          </Link>

        </div>
      </main>
    </div>
  );
}
