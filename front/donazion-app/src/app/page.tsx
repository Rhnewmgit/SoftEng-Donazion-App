import Image from "next/image";
import styles from "./page.module.css";

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

          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Doner Dashboard
          </a>

           {/* NEXT BUTTON    Organization     was      styles.secondary*/}

          <a
            className={styles.primary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Organization
          </a>

          {/* NEXT BUTTON    Donation Center */}

          <a
            className={styles.primary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donation Center
          </a>

        </div>
      </main>
    </div>
  );
}
