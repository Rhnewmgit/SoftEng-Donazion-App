'use client'
import Link from "next/link";
import styles from "@/app/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReigsterDonationCenter(){

    const registerDonationCenter = async () => {
        if(!Name || !Password || !Street1 || !City || !State || !Longitude || !Latitude || organizationId === 0) {
            setError("Please fill in all required fields.")
            return;
        }
        setError("")
        // Here you would make an API call to register the donation center
        // For now, we will just log the data to the console
        console.log("Registering donation center with the following data:");
        console.log({ Name, Password, Street1, Street2, City, State, Longitude, Latitude, organizationId });
        router.push("/donation-center/login")
    }

    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [Street1, setStreet1] = useState("");
    const [Street2, setStreet2] = useState("");
    const [City, setCity] = useState("");
    const [State, setState] = useState("");
    const [Longitude, setLongitude] = useState("");
    const [Latitude, setLatitude] = useState("");
    const [organizations, setOrganizations] = useState([
        { id: 1, name: "Organization 1" },
        { id: 2, name: "Organization 2" },
        { id: 3, name: "Organization 3" }
    ]);
    const [organizationId, setOrganizationId] = useState(0);
    const router = useRouter();
    const [error, setError] = useState("");



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

          <input data-testid="Password" value={Password}
            onChange={(e) => setPassword(e.target.value)} />

          {/*Street 1 text box  */}

          <label>Street 1</label>

          <input data-testid="Street1" value={Street1}
            onChange={(e) => setStreet1(e.target.value)} />

          {/*Street 2 text box  */}

          <label>Street 2 (Optional)</label>

          <input data-testid="Street2" value={Street2}
            onChange={(e) => setStreet2(e.target.value)} />

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

        {/* Organization Dropdown Menu */}
            <select id="organizationSelect" data-testid="organizationSelect" defaultValue={""}
                onChange={(e) => setOrganizationId(Number(e.target.value))}>
            <option value="">
            Select Organization
            </option>
                    
            {organizations.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
            ))}
            
            </select>

        {/* NEXT BUTTON    Register*/}

          <button className={styles.primary} onClick={registerDonationCenter}>
            Register
          </button>

          {error && <p style={{color: "red"}}>{error}</p>}


        </main>
        </div>
    )
}