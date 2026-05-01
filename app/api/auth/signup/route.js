import { db } from "../../../../firebaseAdmin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Check if user exists
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (!querySnapshot.empty) {
      return NextResponse.json({ message: "User already exists" }, { status: 422 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to Firestore
    await usersRef.add({
      name,
      email,
      password: hashedPassword,
      image: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
