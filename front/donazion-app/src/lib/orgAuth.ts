import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Put at the top of every logged-in Organization page.
// No token in the browser's notebook makes you go back to the login page
export function useRequireOrgLogin() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("orgToken")) {
      router.replace("/organization");
    }
  }, [router]);
}

// Log Out: erase the token from the notebook.
export function logOutOrg() {
  localStorage.removeItem("orgToken");
}