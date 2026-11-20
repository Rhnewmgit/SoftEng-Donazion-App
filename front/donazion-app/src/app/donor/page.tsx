'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";






// FAKE API CALL TO BE REPLACED WHEN API IS FINISHED
type ListCentersResult = {
  statusCode: number;
  body: { centers?: { name: string }[]; error?: string };
};

const PAGE_SIZE = 3; // centers per page (ask Maxwell what the real API uses)

const FAKE_CENTERS = [
  { name: "Downtown Donation Center" },
  { name: "Westside Center" },
  { name: "Northgate Center" },
  { name: "Lakeview Center" },
  { name: "Elm Street Center" },
  { name: "Riverside Center" },
  { name: "Hilltop Center" },
];

async function listDonationCenters(page: number): Promise<ListCentersResult> {
  if (page < 1) {
    return { statusCode: 400, body: { error: "Unable to retrieve donationCenter list" } };
  }
  const start = (page - 1) * PAGE_SIZE;
  return { statusCode: 200, body: { centers: FAKE_CENTERS.slice(start, start + PAGE_SIZE) } };
}





export default function DonorDashboard() {

    // Constants / data
  const [centers, setCenters] = useState<{ name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");



    // functions
  // Runs when the page opens AND every time `page` changes
  useEffect(() => {
    async function loadCenters() {
      setError("");
      const result = await listDonationCenters(page);

      if (result.statusCode === 200) {
        setCenters(result.body.centers ?? []);
      } else {
        setError(result.body.error ?? "Could not load donation centers");
      }
    }
    loadCenters();
  }, [page]);




  return (
   <div className={styles.page}>
      <main className={styles.main}>

    

        <h1>Donor Dashboard</h1>


        <h2>Donation Centers</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {centers.map((center) => (
            <li key={center.name}>{center.name}</li>
          ))}
        </ul>

        <p>Page {page}</p>




        <div className={styles.ctas}>
          <button
            className={styles.primary}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}>
            ← Previous
          </button>

          <button
            className={styles.primary}
            onClick={() => setPage(page + 1)}
            disabled={centers.length < PAGE_SIZE}>
            Next →
          </button>
        </div>



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