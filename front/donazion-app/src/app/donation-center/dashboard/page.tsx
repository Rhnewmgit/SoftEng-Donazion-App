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

  const addWishlistItem = async () => {
       
    }

  const removeWishlistItem = async () => {
       
    }

  const removeFromOrganization = async (centerId: string) => {
    setDonationCenters((prev) => prev.filter((center) => center.id !== centerId));
    router.push("/donation-center/login")

  }


  const [WishlistItem, setWishlistItem] = useState<string>("");
  const [donationCenters, setDonationCenters] = useState<DonationCenter[]>([
    {id: "1", name: "Worcester Donation Center"},
    {id: "2", name: "Boston Donation Center"},
    {id: "3", name: "New York Donation Center"}
  ]);
  const router = useRouter();
    



  return (
    <div className={styles.page}>
        <main className={styles.main}>
   
          
        <h1>Donation Center Dashboard</h1>

        <div className={styles.ctas}>
        

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

          <button className={styles.primary} onClick={() => removeFromOrganization(donationCenters[0].id)}
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px' }}>
            Remove from Organization
          </button>





        </div>


        <Link href="/donation-center" onClick={logOutDon}>← Log Out</Link>
      </main>
    </div>
  );
}