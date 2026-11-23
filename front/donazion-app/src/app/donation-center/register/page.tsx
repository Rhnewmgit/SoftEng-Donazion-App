'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = "https://plx0u8g05c.execute-api.us-east-2.amazonaws.com/prod";

type LoginResult = { statusCode: number; body: { name?: string; token?: string; error?: string } };

  async function registerDonationCenter(
    name: string,
    password: string,
    street1: string,
    street2: string,
    zip: number,
    city: string,
    state: string,
    longitude: number,
    latitude: number
  ): Promise<LoginResult> {

    try {
      const response = await fetch(`${API_URL}/api/donationcenter/register`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          street1: street1,
          street2: street2,
          zip: zip,
          city: city,
          state: state,
          long: longitude,
          lat: latitude,
          password: password
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        return {
          statusCode: 200,
          body: {
            name: data.name,
            token: data.token
          }
        };
      }

      return {
        statusCode: response.status,
        body: {
          error: data.error || "Registration failed"
        }
      };

    } catch (error) {
      console.error("Registration error:", error);

      return {
        statusCode: 500,
        body: { error: "Could not reach the server" }
      };
    }
  }


export default function ReigsterDonationCenter(){

  // functions
  async function handleRegister() {
  if (
    !Name.trim() ||
    !Password.trim() ||
    !Street1.trim() ||
    !ZipCode ||
    !City.trim() ||
    !State.trim() ||
    Longitude.trim() === "" ||
    Latitude.trim() === ""
  ) {
    setError("Please fill in all required fields.");
    return;
  }

  const longitude = Number(Longitude);
  const latitude = Number(Latitude);

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude) ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    setError("Please enter valid latitude and longitude values.");
    return;
  }

  setError("");

  const result = await registerDonationCenter(
    Name,
    Password,
    Street1,
    Street2,
    Number(ZipCode),
    City,
    State,
    longitude,
    latitude
  );

  if (result.statusCode === 200) {
    localStorage.setItem("donToken", result.body.token ?? "");
    router.push("/donation-center/dashboard");
  } else {
    setError(result.body.error ?? "Registration failed");
  }
}

    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [Street1, setStreet1] = useState("");
    const [Street2, setStreet2] = useState("");
    const [ZipCode, setZipCode] = useState("");
    const [City, setCity] = useState("");
    const [State, setState] = useState("");
    const [Longitude, setLongitude] = useState("");
    const [Latitude, setLatitude] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    return (
        <div className={styles.page}>
        <main className={styles.main}>

            <h1> Register Donation Center </h1>

            

        {/*Name text box  */}

          <label>Name</label>

          <input data-testid="Name" value={Name}
            onChange={(e) => setName(e.target.value)} />

        {/*Password text box  */}

          <label>Create Password</label>

          <input data-testid="Password" type="password" value={Password}
            onChange={(e) => setPassword(e.target.value)} />

          {/*Street 1 text box  */}

          <label>Street 1</label>

          <input data-testid="Street1" value={Street1}
            onChange={(e) => setStreet1(e.target.value)} />

         {/*Street 2 text box  */}

          <label>Street 2 (Optional)</label>

          <input data-testid="Street2" value={Street2}
            onChange={(e) => setStreet2(e.target.value)} />

          {/*Zip Code text box  */}

          <label>Zip Code</label>

          <input data-testid="ZipCode" value={ZipCode}
            onChange={(e) => setZipCode(e.target.value)} />

        {/*City text box  */}

          <label>City</label>

          <input data-testid="City" value={City}
            onChange={(e) => setCity(e.target.value)} />

        {/*State text box  */}

          <label>State</label>

          <input data-testid="State" value={State}
            onChange={(e) => setState(e.target.value)} />

        {/*Longitude text box  */}

          <label>Longitude</label>

          <input data-testid="Longitude" value={Longitude}
            onChange={(e) => setLongitude(e.target.value)} />

        {/*Latitude text box  */}

          <label>Latitude</label>

          <input data-testid="Latitude" value={Latitude}
            onChange={(e) => setLatitude(e.target.value)} />
            
          

        {/* NEXT BUTTON    Register*/}

          <button className={styles.primary} onClick={handleRegister}>
            Register
          </button>

          

          {error && <p style={{color: "red"}}>{error}</p>}
          
          <Link href="/">← back</Link>
          


        </main>
        </div>
    )
}