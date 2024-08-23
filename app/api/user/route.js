import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USER_DETAILS } from "@/utils/schema";
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm/expressions';

export async function POST(req) {
    try {
        const data = await req.json();
        
        // Insert user details into the database
        const result = await db.insert(USER_DETAILS)
            .values({
                name: data?.name,
                gender: data?.gender,
                mobile: data?.mobile,
                birth_date: new Date(data?.birth_date),
                password: data?.password,
                username: data?.username,
                education: data?.education,
                student: data?.student,
                college: data?.college,
                university: data?.university,
                yearOfPassing: data?.yearOfPassing,
                monthOfPassing: data?.monthOfPassing,
            });
        console.log("Got daat result ", result);
        if (!result) {
            return NextResponse.json(
                { message: 'User registration failed' },
                { status: 500 }  // Internal Server Error
            );
        }

        const [user] = await db
            .select()
            .from(USER_DETAILS)
            .where(eq(USER_DETAILS.username, data?.username));

        if (!user) {
            return NextResponse.json(
                { message: 'User not found after registration' },
                { status: 404 }  // Not Found
            );
        }
        console.log("user", user);
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET_KEY,
            // { expiresIn: '1h' }  // Token expires in 1 hour
        );
        console.log("token", token);
        return NextResponse.json(
            {
                data: { user, token },
                message: 'User registered and authenticated successfully',
            },
            { status: 201 } 
        );
    } catch (error) {
        console.error('Error in POST:', error);
        return NextResponse.json(
            { message: error.message || 'An unexpected error occurred' },
            { status: 500 }  // Internal Server Error
        );
    }
}