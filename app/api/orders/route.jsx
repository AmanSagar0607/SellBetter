import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { ordersTable, cartTable, productsTable, usersTable } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import EmailOrder from "@/emails/email";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { orderDetails, userId } = await req.json();
    console.log("Received data:", { orderDetails });

    if (!orderDetails || !Array.isArray(orderDetails)) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Get user email from database
    const user = await db.select({
      email: usersTable.email
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .then(rows => rows[0]);

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Process orders with quantities
    const processedOrders = orderDetails.map((order) => {
      const quantity = order.quantity || 1;
      const itemTotal = Number(order.price) * quantity;

      return {
        userId,
        productId: parseInt(order.productId),
        title: order.title,
        price: order.price,
        category: order.category || 'Uncategorized',
        imageUrl: order.imageUrl || null,
        productUrl: order.productUrl || null,
        quantity: quantity,
        totalPrice: itemTotal
      };
    });

    console.log("Processed orders:", processedOrders);

    // Validate all required fields are present
    const invalidOrders = processedOrders.filter(
      order => !order.productId || !order.title || !order.price
    );

    if (invalidOrders.length > 0) {
      console.error("Invalid orders:", invalidOrders);
      return NextResponse.json(
        { error: "Some orders are missing required fields" },
        { status: 400 }
      );
    }

    // Insert orders into database
    const response = await db.insert(ordersTable).values(processedOrders);

    // Delete user cart
    await db.delete(cartTable).where(eq(cartTable.userId, userId));

    // Calculate total amount
    const totalAmount = processedOrders.reduce((sum, order) => 
      sum + Number(order.totalPrice), 0
    );

    // Send Email with user's email
    const sendEmailResponse = await sendEmail(processedOrders, totalAmount, user.email);
    console.log("Email sent to:", user.email);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}

const sendEmail = async (orderDetails, totalAmount, userEmail) => {
  try {
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      throw new Error("No valid order details to send in email.");
    }

    // Log email data for verification
    console.log("Sending email to:", userEmail);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      // to: userEmail,
      to: "amansagar0307@gmail.com",
      subject: "Your Order Confirmation | SellBetter",
      react: <EmailOrder 
        orderDetails={orderDetails} 
        totalAmount={totalAmount} 
      />,
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    const orders = await db
      .select({
        orderId: ordersTable.id,
        productId: ordersTable.productId,
        title: ordersTable.title,
        price: ordersTable.price,
        category: ordersTable.category,
        imageUrl: ordersTable.imageUrl,
        productUrl: ordersTable.productUrl,
        quantity: ordersTable.quantity,
        totalPrice: ordersTable.totalPrice,
        createdAt: ordersTable.createdAt,
      })
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
