"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ImageUpload from './_components/ImageUpload';
import FileUpload from './_components/FileUpload';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@clerk/nextjs";



function ClientOnly({ children }) {
    return <>{children}</>;
}

function AddProduct() {
    const { getToken } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        originalPrice: "",
        category: "",
        description: "",
        about: "",
        message: "",
        productImage: null,
        productFile: null
    });

    const [imageKey, setImageKey] = useState(0);
    const [fileKey, setFileKey] = useState(0);

    const resetForm = () => {
        setFormData({
            title: "",
            price: "",
            originalPrice: "",
            category: "",
            description: "",
            about: "",
            message: "",
            productImage: null,
            productFile: null
        });
        setImageKey(prev => prev + 1);
        setFileKey(prev => prev + 1);
    };

    const categoryOptions = [
        { value: "UI kits", label: "UI Kits" },
        { value: "Source Code", label: "Source Code" },
        { value: "Design kits", label: "Design Kits" },
        { value: "UI Design", label: "UI Design" },
        { value: "Mockups", label: "Mockups" },
        { value: "Icons", label: "Icons" },
        { value: "Fonts", label: "Fonts" },
        { value: "Illustrations", label: "Illustrations" },
        { value: "Logos", label: "Logos" },
        { value: "Templates", label: "Templates" },
        { value: "Components", label: "Components" },
        { value: "Themes", label: "Themes" },
        { value: "Plugins", label: "Plugins" },
        { value: "Documents", label: "Documents" },
        { value: "Other", label: "Other" },
    ];

    const handleInputChange = (fieldName, fieldValue) => {
        // Special handling for price fields to maintain decimal precision
        if (fieldName === 'price' || fieldName === 'originalPrice') {
            // Ensure value is a valid number and has at most 2 decimal places
            const value = fieldValue.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) return; // Don't allow multiple decimal points
            if (parts[1] && parts[1].length > 2) return; // Don't allow more than 2 decimal places

            setFormData(prev => ({
                ...prev,
                [fieldName]: value
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const handleImageUpload = (file) => {
        if (file instanceof File) {
            console.log('Setting valid image file:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
            setFormData(prev => ({
                ...prev,
                productImage: file
            }));
            toast.success('Image Uploaded', {
                description: 'Product image has been successfully uploaded.'
            });
        } else {
            console.log('Clearing image file');
            setFormData(prev => ({
                ...prev,
                productImage: null
            }));
        }
    };

    const handleFileUpload = (file) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                productFile: file
            }));
            toast.success('File Uploaded', {
                description: 'Product file has been successfully uploaded.'
            });
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsSubmitting(true);
            const loadingToastId = toast.loading('Adding your product...');

            // Validate required fields
            if (!formData.title || !formData.price || !formData.category || !formData.description) {
                toast.dismiss(loadingToastId);
                toast.error('Missing required fields', {
                    description: 'Please fill in all required fields'
                });
                return;
            }

            // Validate files
            if (!formData.productImage || !formData.productFile) {
                toast.dismiss(loadingToastId);
                toast.error('Missing files', {
                    description: 'Please upload both product image and file'
                });
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('productImage', formData.productImage);
            formDataToSend.append('productFile', formData.productFile);

            const dataForJson = {
                title: formData.title,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
                category: formData.category,
                description: formData.description,
                about: formData.about || '',
                message: formData.message || ''
            };

            formDataToSend.append('data', JSON.stringify(dataForJson));

            const token = await getToken();
            const result = await axios.post('/api/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (result.data.success) {
                toast.dismiss(loadingToastId);
                toast.success('Product Successfully Listed', {
                    description: 'Your digital product has been added to the marketplace.'
                });
                resetForm();
                router.push('/dashboard');
            } else {
                throw new Error(result.data.message || 'Failed to upload product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product', {
                description: error.response?.data?.message || error.message || 'An unexpected error occurred'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <ClientOnly>
            <ScrollArea className="h-full">
                <div className="min-h bg-black">
                    <div className='px-8 md:px-32 lg:px-36 py-12 min-h-screen'>
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-2">
                                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text tracking-tight">
                                    Add New Product
                                </h2>
                                <p className="text-gray-400 text-lg">Create and share your amazing digital products</p>
                            </div>
                        </div>


                        <form onSubmit={handleProductSubmit} className="max-w-7xl mx-auto">
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12'>
                                {/* Left Column */}
                                <div className='space-y-6'>
                                    {/* Product Image Upload */}
                                    <div className='bg-[#0C0C0C] p-6 rounded-xl border border-gray-800  transition-colors duration-300'>
                                        <ImageUpload
                                            key={imageKey}
                                            onImageUpload={handleImageUpload}
                                            value={formData.productImage}
                                        />
                                    </div>

                                    {/* Product File Upload */}
                                    <div className='bg-[#0C0C0C] p-6 rounded-xl border border-gray-800  transition-colors duration-300'>
                                        <FileUpload
                                            key={fileKey}
                                            onFileUpload={handleFileUpload}
                                            value={formData.productFile}
                                        />
                                    </div>

                                    {/* Message to User */}
                                    <div className='bg-[#0C0C0C] p-6 rounded-xl border border-gray-800  transition-colors duration-300'>
                                        <h4 className="text-lg font-semibold mb-3 text-white/90">Message to User</h4>
                                        <Textarea
                                            value={formData.message}
                                            placeholder="Add a personal message to your buyers..."
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            className="bg-black/50 text-white border-gray-800 border focus:border-[#EE519F]/50 focus:ring-[#EE519F]/50 h-12 rounded-lg transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className='space-y-6'>
                                    {/* Product Details Card */}
                                    <div className='bg-[#0C0C0C] p-6 rounded-xl border border-gray-800  transition-colors duration-300'>
                                        <div className="space-y-6">
                                            {/* Product Title */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2 text-white/90">Product Title</h4>
                                                <Input
                                                    type="text"
                                                    value={formData.title}
                                                    placeholder="Enter your product title"
                                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                                    className="bg-black/50 text-white border-gray-800 border focus:border-[#EE519F]/50 focus:ring-[#EE519F]/50 h-12 rounded-lg transition-colors"
                                                />

                                            </div>

                                            {/* Price Section */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold mb-2 text-white/90">Price</h4>
                                                    <Input
                                                        type="text"
                                                        value={formData.price}
                                                        placeholder="Ex. 69.99"
                                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                                        className="bg-black/50 text-white border-gray-800 border focus:border-[#EE519F]/50 focus:ring-[#EE519F]/50 h-12 rounded-lg transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold mb-2 text-white/90">Original Price</h4>
                                                    <Input
                                                        type="text"
                                                        value={formData.originalPrice}
                                                        placeholder="Ex. 99.99"
                                                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                                                        className="bg-black/50 text-white border-gray-800 border focus:border-[#EE519F]/50 focus:ring-[#EE519F]/50 h-12 rounded-lg transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2 text-white/90">Category</h4>
                                                <Select
                                                    value={formData.category}
                                                    onValueChange={(value) => handleInputChange('category', value)}
                                                >
                                                    <SelectTrigger className="bg-black/50 text-white border border-gray-800 h-12 rounded-lg transition-colors focus:border-[#EE519F]/10 focus:ring-[#EE519F]/50">
                                                        <SelectValue placeholder="Choose a category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#0C0C0C] border-gray-800">
                                                        {categoryOptions.map((category) => (
                                                            <SelectItem
                                                                key={category.value}
                                                                value={category.value}
                                                                className="text-white hover:bg-[#EE519F]/10"
                                                            >
                                                                {category.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Description Fields */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2 text-white/90">Description</h4>
                                                <Textarea
                                                    value={formData.description}
                                                    placeholder="Describe your product in detail..."
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    className="bg-black/50 text-white border-gray-800 border focus:border-[#EE519F]/50 focus:ring-[#EE519F]/50 min-h-[100px] rounded-lg transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-semibold mb-2 text-white/90">About Product</h4>
                                                <Textarea
                                                    value={formData.about}
                                                    placeholder="Share additional details about your product..."
                                                    onChange={(e) => handleInputChange('about', e.target.value)}
                                                    className="bg-black/50 text-white border-gray-800 border focus:border-[#EE519F]/50 focus:ring-[#EE519F]/50 min-h-[100px] rounded-lg transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#EE519F] hover:bg-[#EE519F]/90 text-white h-12 text-base font-semibold rounded-lg transition-all duration-300 transform hover:bg-[#EE519F]/90 "
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Creating Product...</span>
                                            </div>
                                        ) : (
                                            "Create Product"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* bottom spacer */}
            <div className="h-32"></div>
                </div>
            </ScrollArea>
            
        </ClientOnly>
    );
}

export default AddProduct;