'use client'
import Link from "next/link";
import React from 'react';
import styles from "@/app/page.module.css";
import { useRequireOrgLogin, logOutOrg } from "@/lib/orgAuth";


export default function Categories() {
  useRequireOrgLogin();
  
  interface Category {
    name: string;
    items: Item[];
  }

  interface Item {
    name: string;
    lowPrice: number;
    highPrice: number;
  }

  const emptyCategory: Category = {
    name: "",
    items: []
  }
  
  const addCategory = (newCategoryName: string) => {
      const trimmed = newCategoryName.trim();
      if(!trimmed) return;

      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === trimmed.toLowerCase()
      );
      if(exists) return;

      setCategories((prev) => [...prev, {name: trimmed, items: []}])
    }

  const addItemToCategory = (category: Category, itemName: string, itemLowPrice: number, itemHighPrice: number) => {
      const trimmed = itemName.trim();
      if (!trimmed) return;

      if (!Number.isFinite(itemLowPrice) || !Number.isFinite(itemHighPrice) || itemLowPrice < 0 || itemHighPrice < itemLowPrice) return;

      const newItem: Item = {
      name: trimmed,
      lowPrice: itemLowPrice,
      highPrice: itemHighPrice
      }

      setCategories((prev) =>
      prev.map((cat) => {
      if (cat.name !== category.name) {
        return cat;
      }

      const hasItem = cat.items.some(
        (item) => item.name.trim().toLowerCase() === trimmed.toLowerCase()
      )

      if (hasItem) return cat

      return {...cat, items: [...cat.items, newItem]}
        })
      )
    }

  const [categories, setCategories] = React.useState<Category[]>([])
  const [categoryName, setCategoryName] = React.useState<string>("")
  const [selectedCategory, setSelectedCategory] = React.useState<Category>(emptyCategory)
  const currentCategory = categories.find((cat) => cat.name === selectedCategory.name);
  const [itemName, setItemName] = React.useState<string>("")
  const [itemLowPrice, setItemLowPrice] = React.useState<string>("")
  const [itemHighPrice, setItemHighPrice] = React.useState<string>("")

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
                const isSelected = selectedCategory.name === category.name;

                return (
                  <li key={category.name}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        fontWeight: isSelected ? "bold" : "normal",
                        backgroundColor: isSelected ? "#0070f3" : "#f0f0f0",
                        color: isSelected ? "#ffffff" : "#000000",
                      }}
                    >
                      {category.name}
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
            <h2>Items in {selectedCategory.name}</h2>

            <p><input type="text" placeholder="New item name" value={itemName} onChange={(e) => setItemName(e.target.value)}/></p>
            <p><input type="number" placeholder="Low price" value={itemLowPrice} onChange={(e) => setItemLowPrice(e.target.value)}/></p>
            <p><input type="number" placeholder="High price" value={itemHighPrice} onChange={(e) => setItemHighPrice(e.target.value)}/></p>
            <button type="button" className="button" disabled={!currentCategory} onClick={() => addItemToCategory(selectedCategory, itemName, Number(itemLowPrice), Number(itemHighPrice))}>Add Item</button>

    <div className = "table-row header">
    <h3>Name:</h3>
    <h3>Low $:</h3>
    <h3>High $:</h3>
  </div>
   ________________________________
   {
    currentCategory?.items.map(item => (
      <div className="table-row" key={item.name}>
        <p>{item.name}</p>
        <p>${item.lowPrice}</p>
        <p>${item.highPrice}</p>
        </div>
    ))}
    
          </div>

          </div>
        </div>

        <Link href="/organization" onClick={logOutOrg}>← Log Out</Link>
      </main>
    </div>
  )

}