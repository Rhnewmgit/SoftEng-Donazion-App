'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRequireOrgLogin, logOutOrg } from "@/lib/orgAuth";
import { useState, useEffect } from "react";



// REAL API: POST /api/organization/dashboard
const API_URL = "https://plx0u8g05c.execute-api.us-east-2.amazonaws.com/prod";

type DashboardResult = {
  statusCode: number;
  body: { centerCount?: number; itemCount?: number; totalValue?: number; error?: string };
};

async function getOrgDashboard(token: string): Promise<DashboardResult> {
  try {
    const response = await fetch(`${API_URL}/api/organization/dashboard`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return {
        statusCode: 200,
        body: {
          centerCount: Number(data.donationCenterCount ?? 0),
          itemCount: Number(data.itemCount ?? 0),
          totalValue: Number(data.itemTotalValue ?? 0),
        },
      };
    }
    return { statusCode: response.status, body: { error: String(data) } };
  } catch {
    return { statusCode: 500, body: { error: "Could not reach the server" } };
  }
}





export default function OrganizationDashboard() {
  useRequireOrgLogin();


  // Constants / data
  const [dashboard, setDashboard] = useState<DashboardResult["body"] | null>(null);
  const [error, setError] = useState("");






    // functions
  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("orgToken") ?? "";
      const result = await getOrgDashboard(token);

      if (result.statusCode === 200) {
        setDashboard(result.body);
      } else {
        setError(result.body.error ?? "Could not load dashboard");
      }
    }
    loadDashboard();
  }, []);





  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.ctas}>


          {/* NEXT BUTTON    Doner Dashboard*/}

          <Link
            className={styles.secondary} 
            href="/organization/OrganizationDashboard">
            Dashboard
          </Link>

          {/* NEXT BUTTON    Categories & Items*/}

          <Link
            className={styles.primary}
            href="/organization/Categories">
            Categories & Items
          </Link>

          {/* NEXT BUTTON    Donation Centers */}

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

        <h1>Organization Dashboard</h1>




        {error && <p style={{ color: "red" }}>{error}</p>}

        {!dashboard && !error && <p>Loading...</p>}

        {dashboard && (
          <div>
            <p>Donation Centers: {dashboard.centerCount}</p>
            <p>Total Items: {dashboard.itemCount}</p>
            <p>Total Value: ${dashboard.totalValue?.toFixed(2)}</p>
          </div>
        )}






        <Link href="/organization" onClick={logOutOrg}>← Log Out</Link>
      </main>
    </div>
  );
}