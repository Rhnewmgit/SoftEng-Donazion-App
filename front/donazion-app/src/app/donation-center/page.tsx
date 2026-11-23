'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";


// REAL API: POST /api/donationcenter/login
const API_URL = "https://plx0u8g05c.execute-api.us-east-2.amazonaws.com/prod";

type LoginResult = { statusCode: number; body: { name?: string; token?: string; error?: string } };

async function loginDonationCenter(name: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_URL}/api/donationcenter/login`, {
      method: "POST",
      body: JSON.stringify({ name, password }),
    });
    const data = await response.json();
    if (response.status === 200) return { statusCode: 200, body: { name: data.name, token: data.token } };
    return { statusCode: response.status, body: { error: String(data) } };
  } catch {
    return { statusCode: 500, body: { error: "Could not reach the server" } };
  }
}





export default function DonationCenter() {



  // Constants / data
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");



  // functions
  async function handleLogin() {
    setError("");
    const result = await loginDonationCenter(Name, Password);

    if (result.statusCode === 200) {
      localStorage.setItem("donToken", result.body.token ?? ""); 
      router.push("/donation-center/dashboard");
    } else {
      setError(result.body.error ?? "Login failed"); // Something iS wrong
    }
  }




  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Donation Center Login</h1>

        <div className={styles.ctas}>

          {/*name text box  */}

          <label>Name</label>

          <input data-testid="Name" value={Name}
            onChange={(e) => setName(e.target.value)} />

          {/*Password text box  */}
          

          <label>Password</label>

          <input data-testid="Password" value={Password}
          type="password"
            onChange={(e) => setPassword(e.target.value)} />


          {/* NEXT BUTTON    Doner Dashboard*/}

          <button className={styles.primary} onClick={handleLogin}>
            Login
          </button>

          {/* NEXT BUTTON    Register*/}

          <Link
            className={styles.primary}
            href="/donation-center/register">
            Register
          </Link>


        </div>

        <Link href="/">← back</Link>


        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
    </div>
  );
}