import { db } from "@/configs/db";
import { cartTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Delete all cart items for this user
        await db.delete(cartTable)
            .where(eq(cartTable.userId, userId));

        return NextResponse.json(
            { success: true, message: "Cart cleared successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error clearing cart:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 