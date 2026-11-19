'use client';
import Link from "next/link";
import React from 'react';
import styles from "@/app/page.module.css";
import { INSPECT_MAX_BYTES } from "buffer";

export default function Categories() {
  const [categoryName, setCategoryName] = React.useState("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);

  const addCategory = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName || categories.includes(trimmedName)) return;

    setCategories((prevCategories) => [...prevCategories, trimmedName]);
    setCategoryName(""); 
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          {/* NEXT BUTTON Doner Dashboard */}
          <Link
            className={styles.primary}
            href="/organization/OrganizationDashboard"
          >
            Dashboard
          </Link>

          {/* NEXT BUTTON Categories & Items */}
          <Link
            className={styles.secondary}
            href="/organization/Categories"
          >
            Categories & Items
          </Link>

          {/* NEXT BUTTON Donation Center */}
          <Link
            className={styles.primary}
            href="/organization/DonationCenter"
          >
            Donation Centers
          </Link>

          {/* NEXT BUTTON Change Password */}
          <Link
            className={styles.primary}
            href="/organization/ChangePassword"
          >
            Change Password
          </Link>
        </div>

        <div>
          <h1>Categories and Items</h1>

          <div style={{display:"flex", gap:"20px"}}>
          <div>
            <h2>Categories</h2>
            <ul>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        fontWeight: isSelected ? "bold" : "normal",
                        backgroundColor: isSelected ? "#0070f3" : "#f0f0f0",
                        color: isSelected ? "#ffffff" : "#000000",
                      }}
                    >
                      {category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          

          <div>
            <input
              type="text"
              placeholder="New category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button
              type="button"
              className="button"
              onClick={() => addCategory(categoryName)}
            >
              Add Category
            </button>
          </div>

          <div>
            <h2>Items in {selectedCategory}</h2>
            <div className = "table-row header">
    <h3>Name:</h3>
    <h3>Low $:</h3>
    <h3>High $:</h3>
  </div>
   ________________________________
   
          </div>

          </div>
        </div>

        <Link href="/organization">← Log Out</Link>
      </main>
    </div>
  );
}