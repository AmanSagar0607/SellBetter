'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

function ImageUpload({ onImageUpload, value, error: externalError }) {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = React.useRef(null);

    // Reset component state when external value changes
    useEffect(() => {
        if (!value) {
            handleDelete();
        }
    }, [value]);

    const validateFile = useCallback((file) => {
        // Check if it's an image file
        if (!file.type.startsWith('image/')) {
            throw new Error('Please upload a valid image format (JPG, PNG, etc.)');
        }
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image size exceeds the 5MB limit. Please optimize and try again.');
        }

        return true;
    }, []);

    const handleFileUpload = useCallback((files) => {
        if (files?.[0]) {
            try {
                const selectedFile = files[0];
                validateFile(selectedFile);

                // Clear any previous errors
                setError('');

                // Set the file and create URL
                setFile(selectedFile);
                const url = URL.createObjectURL(selectedFile);
                setImageUrl(url);

                // Call the parent handler with the file
                onImageUpload?.(selectedFile);
            } catch (err) {
                setError(err.message);
                onImageUpload?.(null);
            }
        }
    }, [onImageUpload, validateFile]);

    const handleDelete = useCallback(() => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setFile(null);
        setImageUrl('');
        setError('');
        onImageUpload?.(null);
    }, [imageUrl, onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': [] // Accept all image types
        },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        onDrop: handleFileUpload,
        onDropRejected: (fileRejections) => {
            const error = fileRejections[0]?.errors[0];
            if (error) {
                setError(
                    error.code === 'file-too-large' 
                        ? 'Image size exceeds the 5MB limit. Please optimize and try again.'
                        : error.code === 'file-invalid-type'
                            ? 'Please upload a valid image format (JPG, PNG, etc.)'
                            : error.message
                );
            }
        }
    });

    const displayError = externalError || error;

    return (
        <div className="w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Upload Product Image</h2>
            
            <AnimatePresence>
                {displayError && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg"
                    >
                        <p className="text-red-500 text-sm">{displayError}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div {...getRootProps()} className="relative w-full">
                <input {...getInputProps()} />
                <motion.div
                    className={cn(
                        "relative w-full min-h-[200px] rounded-xl transition-all duration-300 cursor-pointer",
                        "bg-[#0C0C0C] border-2 border-dashed overflow-hidden",
                        isDragActive
                            ? "border-[#EE519F] bg-[#1a1a1a]"
                            : "border-[#2a2a2a] hover:border-[#EE519F]/50 hover:bg-[#1a1a1a]",
                        displayError && "border-red-500"
                    )}
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <GridPattern />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px] p-6">
                        <AnimatePresence mode="wait">
                            {!imageUrl ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className={cn(
                                            "mx-auto w-16 h-16 rounded-xl flex items-center justify-center",
                                            "bg-[#1a1a1a] border-2 border-[#2a2a2a]"
                                        )}
                                    >
                                        <IconUpload className="w-8 h-8 text-[#EE519F]" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <p className="text-white font-medium">
                                            {isDragActive ? "Drop to upload" : "Upload Image"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Drag and drop or click to select
                                        </p>
                                        <p className="text-xs text-gray-500 bg-[#0C0C0C] px-4 py-2 rounded-full inline-block">
                                            Supports all image types (Max 5MB)
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full max-w-[200px] mx-auto"
                                >
                                    <div className="relative">
                                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#EE519F]">
                                            <Image
                                                src={imageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                sizes="200px"
                                                priority
                                            />
                                        </div>
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete();
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-[#EE519F] rounded-full flex items-center justify-center shadow-lg z-20"
                                        >
                                            <IconX className="w-5 h-5 text-white" />
                                        </motion.button>
                                    </div>
                                    <p className="text-sm text-gray-400 text-center mt-4">
                                        Click or drag to replace
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function GridPattern() {
    return (
        <div className="absolute inset-0 grid grid-cols-8 gap-0.5 opacity-10">
            {Array.from({ length: 64 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent aspect-square"
                />
            ))}
        </div>
    );
}

export default ImageUpload;