"use client";
import React, { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

const GetStartedButton = React.memo(function GetStartedButton() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/role-select");
      }
    });

    return () => unsubscribe();
  }, [router]);

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
});

export default GetStartedButton;