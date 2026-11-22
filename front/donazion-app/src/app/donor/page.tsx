'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";






// REAL API: POST /api/donor/listcenter
const API_URL = "https://plx0u8g05c.execute-api.us-east-2.amazonaws.com/prod";

type ListCentersResult = {
  statusCode: number;
  body: { centers?: { name: string }[]; error?: string };
};

const PAGE_SIZE = 3;

async function listDonationCenters(page: number): Promise<ListCentersResult> {
  try {
    const response = await fetch(`${API_URL}/api/donor/listcenter`, {
      method: "POST",
      body: JSON.stringify({ page, pageSize: PAGE_SIZE }),
    });
    const data = await response.json();
    if (response.status === 200) return { statusCode: 200, body: { centers: data } };
    return { statusCode: response.status, body: { error: String(data) } };
  } catch {
    return { statusCode: 500, body: { error: "Could not reach the server" } };
  }
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