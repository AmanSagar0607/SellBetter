import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { user } = await req.json();
        console.log('Received user data:', JSON.stringify(user, null, 2));

        // Validate required fields
        if (!user?.firstName || !user?.lastName || !user?.emailAddresses?.[0]?.emailAddress) {
            const error = {
                firstName: !user?.firstName,
                lastName: !user?.lastName,
                email: !user?.emailAddresses?.[0]?.emailAddress
            };
            console.log('Validation failed:', error);
            return NextResponse.json(
                { error: "Invalid user data", details: error },
                { status: 400 }
            );
        }

        // Create name with validation
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        if (!fullName) {
            return NextResponse.json(
                { error: "Invalid name" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.select()
            .from(usersTable)
            .where(eq(usersTable.email, user.emailAddresses[0].emailAddress));

        if (existingUser.length > 0) {
            console.log('User already exists:', existingUser[0]);
            return NextResponse.json(existingUser[0]);
        }

        // Get the image URL from user data
        const imageUrl = user.imageUrl || user.profileImageUrl || null;
        console.log('Image URL:', imageUrl);

        // Create new user with validated data
        const newUser = {
            name: fullName,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: imageUrl
        };

        console.log('Creating new user:', newUser);

        const result = await db.insert(usersTable)
            .values(newUser)
            .returning();

        console.log('User created:', result[0]);
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            stack: error.stack,
            data: error.response?.data
        });
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}