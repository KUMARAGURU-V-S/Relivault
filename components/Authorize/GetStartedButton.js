"use client";
import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

function GetStartedButton() {
  const router = useRouter();

  const handleGetStarted = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // User signed in
      const user = result.user;
      // Redirect to role selection page
      router.push("/role-select");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleGetStarted}>Get Started</button>;
}

export default GetStartedButton;