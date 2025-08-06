"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration: 1 week
const SESSION_DURANTION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create a session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURANTION * 1000, // Miliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURANTION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user exits in the database
    const userRef = await db.collection("users").doc(uid).get();

    if (userRef.exists) {
      return {
        success: false,
        message: "This user already exists in the database. Please, sign in.",
      };
    }

    // Save new user to the database
    await db.collection("users").doc(uid).set({ name, email });

    return {
      success: true,
      message: "New account created successfully! Please, enjoy",
    };
  } catch (error: any) {
    console.error("Error creating new user");

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email already exits in the database",
      };
    }

    return {
      success: false,
      message: "Failed to create a new account. Please, try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRef = await auth.getUserByEmail(email);

    if (!userRef) {
      return {
        success: false,
        message:
          "This user doesn't exist in the database. Please, create a new account.",
      };
    }

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into your account. Please, try again.",
    };
  }
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get user info form databasde
    const userRef = await db.collection("users").doc(decodedClaims.uid).get();
    if (!userRef.exists) return null;

    return {
      ...userRef.data,
      id: userRef.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Chek if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
