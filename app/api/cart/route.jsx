import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { eq, and } from 'drizzle-orm';
import { cartTable, productsTable } from '@/configs/schema';
import { getTableColumns } from 'drizzle-orm';


export async function POST(req) {
    try {
        const { userId, productId } = await req.json();
        
        if (!userId || !productId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const response = await db.insert(cartTable).values({
            userId,
            productId
        }).returning();

        return NextResponse.json({ 
            success: true, 
            data: response[0] 
        });
    } catch (error) {
        console.error('Cart API Error:', error);
        return NextResponse.json(
            { error: 'Failed to add item to cart' },
            { status: 500 }
        );
    }
}


export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get('userId');
    
    const response = await db.select(
        {
            ...getTableColumns(productsTable),
            ...getTableColumns(cartTable),
        }).from(cartTable)
        .innerJoin(productsTable, eq(cartTable.productId, productsTable.id))
        .where(eq(cartTable.userId, userId));

    return NextResponse.json({ 
        success: true, 
        data: response 
    });

}

export async function DELETE(req) {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');

        console.log('Attempting to delete cart item:', { userId, productId });

        if (!userId || !productId) {
            console.error('Missing required fields:', { userId, productId });
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // First verify if the item exists
        const existingItem = await db
            .select()
            .from(cartTable)
            .where(
                and(
                    eq(cartTable.userId, userId),
                    eq(cartTable.productId, productId)
                )
            )
            .limit(1);

        if (!existingItem || existingItem.length === 0) {
            console.error('Item not found in cart');
            return NextResponse.json(
                { error: 'Item not found in cart' },
                { status: 404 }
            );
        }

        // Delete the item
        const response = await db
            .delete(cartTable)
            .where(
                and(
                    eq(cartTable.userId, userId),
                    eq(cartTable.productId, productId)
                )
            );

        console.log('Successfully deleted cart item:', response);

        return NextResponse.json({ 
            success: true, 
            data: response 
        });
    } catch (error) {
        console.error('Delete Cart Item Error:', error);
        return NextResponse.json(
            { error: 'Failed to remove item from cart' },
            { status: 500 }
        );
    }
}