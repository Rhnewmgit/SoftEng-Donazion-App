'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRequireOrgLogin, logOutOrg } from "@/lib/orgAuth";


import { useState } from "react";

// REAL API: POST /api/organization/passwordreset
const API_URL = "https://plx0u8g05c.execute-api.us-east-2.amazonaws.com/prod";

type ChangePasswordResult = { statusCode: number; body: { token?: string; error?: string } };

async function changeOrgPassword(oldPass: string, newPass: string): Promise<ChangePasswordResult> {
  try {
    const token = localStorage.getItem("orgToken") ?? "";
    const response = await fetch(`${API_URL}/api/organization/passwordreset`, {
      method: "POST",
      body: JSON.stringify({ token, oldPass, newPass }),
    });
    const data = await response.json();
    if (response.status === 200) return { statusCode: 200, body: { token: data.token } };
    return { statusCode: response.status, body: { error: String(data) } };
  } catch {
    return { statusCode: 500, body: { error: "Could not reach the server" } };
  }
}





export default function ChangePassword() {
  useRequireOrgLogin();

  
  // Constants / data
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");

  // functions
  async function handleChangePassword() {
    const result = await changeOrgPassword(oldPass, newPass);

    if (result.statusCode === 200) {
      localStorage.setItem("orgToken", result.body.token ?? "");
      setMessage("Password changed");
    } 
    else {
      setMessage(result.body.error ?? "Could not change password");
    }
  }




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
            className={styles.primary}
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
            className={styles.secondary}
            href="/organization/ChangePassword">
            Change Password
          </Link>

        </div>

        <h1>Change Password</h1>

        
        <div className={styles.ctas}>
          <label>Current Password</label>
          <input type="password" value={oldPass}
            onChange={(e) => setOldPass(e.target.value)} />

          <label>New Password</label>
          <input type="password" value={newPass}
            onChange={(e) => setNewPass(e.target.value)} />

          <button className={styles.primary} onClick={handleChangePassword}>
            Change Password
          </button>
        </div>

        <p>{message}</p>

        <Link href="/organization" onClick={logOutOrg}>← Log Out</Link>
      </main>
    </div>
  );
}