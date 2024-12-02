import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { desc, eq, sql, and, or, gte, lte, ilike } from "drizzle-orm";
import { productsTable, usersTable } from "@/configs/schema";

async function handler(req) {
    try {
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const page = parseInt(url.searchParams.get('page')) || 1;
        const offset = (page - 1) * limit;
        const search = url.searchParams.get('search');
        const categories = url.searchParams.get('categories')?.split(',').filter(Boolean);
        const sort = url.searchParams.get('sort');

        console.log('Query params:', { limit, page, offset, search, categories, sort });

        // Build the where clause based on filters
        let whereConditions = [];

        // Search filter
        if (search) {
            whereConditions.push(
                or(
                    ilike(productsTable.title, `%${search}%`),
                    ilike(productsTable.description, `%${search}%`),
                    ilike(productsTable.category, `%${search}%`)
                )
            );
        }

        // Category filters
        if (categories?.length > 0) {
            const categoryConditions = categories.map(category => {
                // Handle price range filters
                if (category.includes('$')) {
                    const isUnder10 = category === 'Under $10';
                    const isOver100 = category === 'Over $100';
                    const [min, max] = category.match(/\d+/g)?.map(Number) || [];

                    if (isUnder10) {
                        return lte(productsTable.price, 10);
                    } else if (isOver100) {
                        return gte(productsTable.price, 100);
                    } else if (min && max) {
                        return and(
                            gte(productsTable.price, min),
                            lte(productsTable.price, max)
                        );
                    }
                }
                // Regular category filter
                return eq(productsTable.category, category);
            });
            whereConditions.push(or(...categoryConditions));
        }

        // Combine all conditions
        const whereClause = whereConditions.length > 0 
            ? and(...whereConditions)
            : undefined;

        // Get total count with filters
        const totalCount = await db
            .select({ count: sql`count(*)::int` })
            .from(productsTable)
            .where(whereClause)
            .then(res => res[0]?.count || 0);

        console.log('Total filtered products:', totalCount);

        // Base query
        let query = db.select({
            id: productsTable.id,
            title: productsTable.title,
            price: productsTable.price,
            originalPrice: productsTable.originalPrice,
            description: productsTable.description,
            about: productsTable.about,
            category: productsTable.category,
            imageUrl: productsTable.imageUrl,
            productUrl: productsTable.productUrl,
            message: productsTable.message,
            createdAt: productsTable.createdAt,
            user: {
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
                image: usersTable.image
            }
        })
        .from(productsTable)
        .leftJoin(usersTable, eq(usersTable.id, productsTable.createdBy))
        .where(whereClause)
        .limit(limit)
        .offset(offset);

        // Apply sorting
        switch (sort) {
            case 'price_low_high':
                query = query.orderBy(productsTable.price);
                break;
            case 'price_high_low':
                query = query.orderBy(desc(productsTable.price));
                break;
            case 'newest':
                query = query.orderBy(desc(productsTable.createdAt));
                break;
            default:
                query = query.orderBy(desc(productsTable.createdAt));
        }

        const products = await query;

        console.log('Filtered products found:', products.length);

        // Transform dates to ISO strings for consistent serialization
        const formattedProducts = products.map(product => ({
            ...product,
            createdAt: product.createdAt?.toISOString(),
            user: product.user?.id ? {
                ...product.user,
                verified: true
            } : null
        }));

        return NextResponse.json({
            products: formattedProducts,
            pagination: {
                total: totalCount,
                page,
                limit,
                hasMore: offset + products.length < totalCount
            }
        });
    } catch (error) {
        console.error('Error in all-products API:', {
            message: error.message,
            stack: error.stack,
            query: error.query,
            params: error.params
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch products',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export const GET = handler;