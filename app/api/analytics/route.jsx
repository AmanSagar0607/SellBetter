import { NextResponse } from 'next/server'
import { db } from '@/configs/db';
import { sql } from 'drizzle-orm'
import { ordersTable, productsTable } from '@/configs/schema';

export async function GET() {
  try {
    const totalEarnings = await db.select({ sum: sql`sum(${ordersTable.totalPrice})` }).from(ordersTable)
    const totalOrders = await db.select({ count: sql`count(*)` }).from(ordersTable)
    const activeProducts = await db.select({ count: sql`count(*)` }).from(productsTable).where(sql`${productsTable.status} = 'active'`)
    const deletedProducts = await db.select({ count: sql`count(*)` }).from(productsTable).where(sql`${productsTable.status} = 'deleted'`)

    const dailyEarnings = await db.select({
      date: sql`date(${ordersTable.createdAt})`,
      total: sql`sum(${ordersTable.totalPrice})`,
    })
    .from(ordersTable)
    .groupBy(sql`date(${ordersTable.createdAt})`)
    .orderBy(sql`date(${ordersTable.createdAt})`)

    const products = await db.select({
      id: productsTable.id,
      title: productsTable.title,
      category: productsTable.category,
      price: productsTable.price,
      totalSales: sql`count(${ordersTable.id})`,
      revenue: sql`sum(${ordersTable.totalPrice})`,
    })
    .from(productsTable)
    .leftJoin(ordersTable, sql`${productsTable.id} = ${ordersTable.productId}`)
    .where(sql`${productsTable.status} = 'active'`)
    .groupBy(productsTable.id)
    .orderBy(sql`sum(${ordersTable.totalPrice})`, 'desc')

    const productCategories = await db.select({
      name: productsTable.category,
      totalSales: sql`count(${ordersTable.id})`,
    })
    .from(productsTable)
    .leftJoin(ordersTable, sql`${productsTable.id} = ${ordersTable.productId}`)
    .where(sql`${productsTable.status} = 'active'`)
    .groupBy(productsTable.category)
    .orderBy(sql`count(${ordersTable.id})`, 'desc')

    return NextResponse.json({
      data: {
        totalEarnings: totalEarnings[0].sum || 0,
        totalOrders: totalOrders[0].count || 0,
        activeProducts: activeProducts[0].count || 0,
        deletedProducts: deletedProducts[0].count || 0,
        dailyEarnings,
        products,
        productCategories,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

