'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";




// FAKE API CALL TO BE REPLACED WHEN API IS FINISHED
type LoginResult = { statusCode: number; body: { token?: string; error?: string } };

async function loginOrganization(password: string): Promise<LoginResult> {
  if (password === "admin123") {
    return { statusCode: 200, body: { token: "fake-token-123" } };
  }
  return { statusCode: 400, body: { error: "password was incorrect" } };
}




export default function LoginPage() {

  // Constants / data
  const [Password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");



  // functions
  async function handleLogin() {
    setError("");
    const result = await loginOrganization(Password);

    if (result.statusCode === 200) {
      localStorage.setItem("orgToken", result.body.token ?? ""); 
      router.push("/organization/OrganizationDashboard");
    } else {
      setError(result.body.error ?? "Login failed"); // Something iS wrong
    }
  }




  // display
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1>Login</h1>

        <div className={styles.ctas}>
          
          {/*Password text box  */}
          
          <label>Password</label>

          <input data-testid="Password" value={Password}
          type="password"
            onChange={(e) => setPassword(e.target.value)} />


          {/* NEXT BUTTON    Doner Dashboard*/}

          <button className={styles.primary} onClick={handleLogin}>
            Login
          </button>


        </div>

        <Link href="/">← back</Link>

        {error && <p style={{ color: "red" }}>{error}</p>}


      </main>
    </div>
  );
}