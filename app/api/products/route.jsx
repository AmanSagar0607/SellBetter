import { NextResponse } from "next/server";
import { db } from '@/configs/db';
import { productsTable, usersTable } from '@/configs/schema';
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';
import { eq,desc, getTableColumns } from 'drizzle-orm';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload to Cloudinary
async function uploadToCloudinary(file, isImage = false) {
    try {
        console.log(`Starting Cloudinary upload for ${isImage ? 'image' : 'file'}: ${file.name}`);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Set up upload options
        const uploadOptions = {
            folder: 'storekart/products',
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            overwrite: true
        };

        // Add specific options for images
        if (isImage) {
            Object.assign(uploadOptions, {
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto:best' }
                ]
            });
        }

        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
        
        console.log('Cloudinary upload successful:', result.secure_url);
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw error;
    }
}

export async function POST(req) {
    // Add CORS headers
    const headers = new Headers({
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    try {
        // Handle OPTIONS request for CORS preflight
        if (req.method === 'OPTIONS') {
            return new NextResponse(null, { status: 204, headers });
        }

        // Validate auth
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401, headers }
            );
        }

        const formData = await req.formData();
        let data;
        try {
            data = JSON.parse(formData.get('data'));
        } catch (error) {
            console.error('Error parsing form data:', error);
            return NextResponse.json(
                { success: false, message: 'Invalid form data format', error: error.message },
                { status: 400, headers }
            );
        }

        const productImage = formData.get('productImage');
        const productFile = formData.get('productFile');

        console.log('Received form data:', {
            data,
            hasImage: !!productImage,
            imageType: productImage?.type,
            hasFile: !!productFile,
            fileType: productFile?.type
        });

        // Validate required files and their types
        if (!productImage || !productFile) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: !productImage ? 'Product image is required' : 'Product file is required' 
                },
                { status: 400, headers }
            );
        }

        // Validate image type
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedImageTypes.includes(productImage.type)) {
            return NextResponse.json(
                { success: false, message: 'Invalid image type. Please use JPG, PNG, or WebP.' },
                { status: 400, headers }
            );
        }

        // Upload files to Cloudinary
        let imageResult, fileResult;

        try {
            console.log('Uploading product image...');
            imageResult = await uploadToCloudinary(productImage, true);
            
            console.log('Uploading product file...');
            fileResult = await uploadToCloudinary(productFile, false);
        } catch (error) {
            // Clean up any uploaded files if either upload fails
            if (imageResult?.publicId) {
                await cloudinary.uploader.destroy(imageResult.publicId);
            }
            if (fileResult?.publicId) {
                await cloudinary.uploader.destroy(fileResult.publicId);
            }
            
            console.error('Upload failed:', error);
            return NextResponse.json(
                { success: false, message: 'Failed to upload files: ' + error.message },
                { status: 500, headers }
            );
        }

        // Prepare product data with proper price handling
        const price = parseFloat(parseFloat(data.price).toFixed(2));
        const originalPrice = parseFloat(parseFloat(data.originalPrice || data.price).toFixed(2));

        // Validate price values
        if (isNaN(price) || price <= 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid price value' },
                { status: 400, headers }
            );
        }

        const productData = {
            title: data.title,
            price: price,
            originalPrice: originalPrice,
            description: data.description,
            about: data.about || null,
            category: data.category,
            imageUrl: imageResult.url,
            productUrl: fileResult.url,
            message: data.message || null,
            createdBy: userId
        };

        // Save to database
        try {
            console.log('Attempting to save product data:', productData);
            console.log('Database connection:', !!db); // Check if db is defined
            console.log('Products table schema:', productsTable); // Log table schema
            
            const result = await db.insert(productsTable)
                .values(productData)
                .returning();
            
            console.log('Product saved successfully:', result[0]);

            return NextResponse.json(
                { success: true, message: 'Product uploaded successfully', data: {
                    id: result[0].id,
                    imageUrl: imageResult.url,
                    productUrl: fileResult.url
                } },
                { headers }
            );
        } catch (error) {
            console.error('Database error details:', {
                message: error.message,
                code: error.code,
                detail: error.detail,
                stack: error.stack,
                name: error.name,
                cause: error.cause
            });

            // Clean up uploaded files on database error
            if (imageResult?.publicId) {
                await cloudinary.uploader.destroy(imageResult.publicId);
            }
            if (fileResult?.publicId) {
                await cloudinary.uploader.destroy(fileResult.publicId);
            }

            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Failed to save product to database',
                    error: error.message,
                    code: error.code
                },
                { status: 500, headers }
            );
        }
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error: ' + error.message },
            { status: 500, headers }
        );
    }
}

export async function GET(req) {
    try {
        // Add CORS headers
        const headers = new Headers({
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });

        // Handle OPTIONS request for CORS preflight
        if (req.method === 'OPTIONS') {
            return new NextResponse(null, { status: 204, headers });
        }

        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers }
            );
        }
        
        console.log('Fetching products for userId:', userId);
        
        // Get products using userId
        const products = await db.select({
            id: productsTable.id,
            title: productsTable.title,
            price: productsTable.price,
            original_price: productsTable.originalPrice,  // Changed to match frontend
            description: productsTable.description,
            about: productsTable.about,
            category: productsTable.category,
            imageUrl: productsTable.imageUrl,
            createdBy: productsTable.createdBy,
            productUrl: productsTable.productUrl,
            message: productsTable.message,
            createdAt: productsTable.createdAt,
            updatedAt: productsTable.updatedAt,
            user: {
                name: usersTable.name,
                image: usersTable.image
            }
        })
            .from(productsTable)
            .leftJoin(usersTable, eq(productsTable.createdBy, usersTable.id))
            .where(eq(productsTable.createdBy, userId))
            .orderBy(desc(productsTable.id));

        console.log('Raw products from database:', products);

        if (!products) {
            return NextResponse.json([], { headers });
        }

        return NextResponse.json(products, { headers });
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        
        return NextResponse.json(
            { error: "Error fetching products", details: error.message },
            { status: 500, headers }
        );
    }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(req) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}