'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRequireOrgLogin, logOutOrg } from "@/lib/orgAuth";


import { useState } from "react";

// FAKE API CALL TO BE REPLACED WHEN API IS FINISHED
type ChangePasswordResult = { statusCode: number; body: { error?: string } };

async function changeOrgPassword(oldPass: string, newPass: string): Promise<ChangePasswordResult> {
  if (oldPass !== "admin123") {
    return { statusCode: 400, body: { error: "password incorrect" } };
  }
  if (newPass === oldPass) {
    return { statusCode: 400, body: { error: "new password same as old password" } };
  }
  return { statusCode: 200, body: {} };
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
      setMessage("Password changed");
    } else {
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