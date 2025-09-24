import Coupon from "@/lib/db/models/Coupon";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Database connection function
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

// Function to check if a coupon is valid based on minimum price
export async function POST(request) {
    await connectToDatabase();
    const { couponCode, cartTotal } = await request.json();
    try {
        // Find the coupon by the correct field: couponTitle
        const coupon = await Coupon.findOne({ couponTitle: couponCode });

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }
        
        // Check if the coupon is active
        if (coupon.status !== "Active") {
            return NextResponse.json({ error: "Coupon is not active" }, { status: 400 });
        }

        // Check if the cart total meets the minimum price requirement
        if (cartTotal < coupon.minPrice) {
            return NextResponse.json({ 
                error: `This coupon is only valid for orders of ₹${coupon.minPrice} or more.` 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            valid: true, 
            discount: coupon.discount,
            couponTitle: coupon.couponTitle,
        }, { status: 200 });
    } catch (error) {
        console.error("Error checking coupon validity:", error);
        return NextResponse.json({ error: "Error checking coupon" }, { status: 500 });
    }
}