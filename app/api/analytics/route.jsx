import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { sql } from 'drizzle-orm';
import { ordersTable, productsTable } from '@/configs/schema';

export async function GET(req) {
  try {
    // Extract userId from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch analytics data for the authenticated user
    const totalEarnings = await db
      .select({ sum: sql`sum(${ordersTable.totalPrice})` })
      .from(ordersTable)
      .where(sql`${ordersTable.userId} = ${userId}`);

    const totalOrders = await db
      .select({ count: sql`count(*)` })
      .from(ordersTable)
      .where(sql`${ordersTable.userId} = ${userId}`);

    const activeProducts = await db
      .select({ count: sql`count(*)` })
      .from(productsTable)
      .where(sql`${productsTable.status} = 'active' AND ${productsTable.createdBy} = ${userId}`);

    const deletedProducts = await db
      .select({ count: sql`count(*)` })
      .from(productsTable)
      .where(sql`${productsTable.status} = 'deleted' AND ${productsTable.createdBy} = ${userId}`);

    const dailyEarnings = await db
      .select({
        date: sql`date(${ordersTable.createdAt})`,
        total: sql`sum(${ordersTable.totalPrice})`,
      })
      .from(ordersTable)
      .where(sql`${ordersTable.userId} = ${userId}`)
      .groupBy(sql`date(${ordersTable.createdAt})`)
      .orderBy(sql`date(${ordersTable.createdAt})`);

    const products = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        category: productsTable.category,
        price: productsTable.price,
        totalSales: sql`count(${ordersTable.id})`,
        revenue: sql`sum(${ordersTable.totalPrice})`,
      })
      .from(productsTable)
      .leftJoin(ordersTable, sql`${productsTable.id} = ${ordersTable.productId}`)
      .where(sql`${productsTable.status} = 'active' AND ${productsTable.createdBy} = ${userId}`)
      .groupBy(productsTable.id)
      .orderBy(sql`sum(${ordersTable.totalPrice})`, 'desc');

    const productCategories = await db
      .select({
        name: productsTable.category,
        totalSales: sql`count(${ordersTable.id})`,
      })
      .from(productsTable)
      .leftJoin(ordersTable, sql`${productsTable.id} = ${ordersTable.productId}`)
      .where(sql`${productsTable.status} = 'active' AND ${productsTable.createdBy} = ${userId}`)
      .groupBy(productsTable.category)
      .orderBy(sql`count(${ordersTable.id})`, 'desc');

    return NextResponse.json({
      data: {
        totalEarnings: totalEarnings[0]?.sum || 0,
        totalOrders: totalOrders[0]?.count || 0,
        activeProducts: activeProducts[0]?.count || 0,
        deletedProducts: deletedProducts[0]?.count || 0,
        dailyEarnings,
        products,
        productCategories,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}