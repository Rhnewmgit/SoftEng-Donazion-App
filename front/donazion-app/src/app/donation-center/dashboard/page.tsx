'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRouter } from "next/navigation";
import { useRequireDonLogin, logOutDon } from "@/lib/orgAuth";
import { useState } from "react";


export default function DonationCenterDashboard() {
  useRequireDonLogin();

  interface DonationCenter {
    id: string;
    name: string;
  }

  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [WishlistItem, setWishlistItem] = useState<string>("");
  const router = useRouter();

// REAL API: POST /api/donationcenter/login
const API_URL = "https://plx0u8g05c.execute-api.us-east-2.amazonaws.com/prod";

  const addWishlistItem = async () => {
       
    }

  const removeWishlistItem = async () => {
       
    }

  const removeFromOrganization = async (name: string, password: string) => {

    const token = localStorage.getItem("donToken");

    try {
      const response = await fetch (
        `${API_URL}/api/donationcenter/delete`,
        {
          method: "POST",
          body: JSON.stringify({
            token: token,
            name: name,
            password: password
          })
        }
      )

      const data = await response.json();

      if(!response.ok){
        alert(
          typeof data === "string"
          ? data
          : data.error || "Failed to delete donation center."
        )
        return
      }

      localStorage.removeItem("donToken");

      alert("Donation center deleted successfully.");

    router.push("/donation-center/login")
    } catch (error){
      console.error("Deletion error:", error)
      alert("Could not connect to the server.")
    }
  }
    
  return (
     <div className={styles.page}>
        <main className={styles.main}>
   
          
        <h1>Donation Center Dashboard</h1>

        
        

          {/* NEXT BUTTON    List Inventory*/}

          <Link
            className={styles.primary}
            href="/donation-center/login">
            List Inventory
          </Link>

          {/*Wishlist Item text box  */}

          <label>Add Wishlist Item:</label>

          <input data-testid="WishlistItem" value={WishlistItem}
            onChange={(e) => setWishlistItem(e.target.value)} />

            {/* NEXT BUTTON   Add Wishlist Item*/}

          <button className={styles.primary} onClick={addWishlistItem}>
            Add
          </button>

          {/* NEXT BUTTON   Remove Wishlist Item*/}

          <button className={styles.primary} onClick={removeWishlistItem}>
            Remove Wishlist Item
          </button>

          {/* NEXT BUTTON   Remove from Organization*/}

          <label>Donation Center Name</label>
          <input value={Name} onChange={(e) => setName(e.target.value)}/>
          <label>Confirm Password</label>
          <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)}/>

          <button className={styles.primary} onClick={() => removeFromOrganization(Name, Password)}
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px' }}>
            Remove from Organization
          </button>





        


        <Link href="/donation-center" onClick={logOutDon}>← Log Out</Link>
      </main>
    </div>
  );
}