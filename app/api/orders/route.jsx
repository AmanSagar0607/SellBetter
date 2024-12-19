import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { ordersTable, cartTable, productsTable } from "@/configs/schema";
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

    // Send Email
    const sendEmailResponse = await sendEmail(processedOrders, totalAmount);
    console.log("Email sent with data:", {
      orders: processedOrders,
      total: totalAmount
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}

const sendEmail = async (orderDetails, totalAmount) => {
  try {
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      throw new Error("No valid order details to send in email.");
    }

    // Log email data for verification
    console.log("Sending email with:", {
      orderDetails: orderDetails.map(o => ({
        title: o.title,
        price: o.price,
        quantity: o.quantity,
        totalPrice: o.totalPrice
      })),
      totalAmount
    });

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email || "amansagar0307@gmail.com",
      subject: "Order Receipt | SellBetter",
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
