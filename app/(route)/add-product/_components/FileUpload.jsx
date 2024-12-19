'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

function FileUpload({ onFileUpload, value, error: externalError }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = React.useRef(null);

    // Reset component state when external value changes
    useEffect(() => {
        if (!value) {
            handleDelete();
        }
    }, [value]);

    const validateFile = useCallback((file) => {
        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            throw new Error('File size exceeds the 50MB limit. Please optimize your content and try again.');
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

                // Set the file
                setFile(selectedFile);

                // Call the parent handler with the file
                onFileUpload?.(selectedFile);
            } catch (err) {
                setError(err.message);
                onFileUpload?.(null);
            }
        }
    }, [onFileUpload, validateFile]);

    const handleDelete = useCallback(() => {
        setFile(null);
        setError('');
        onFileUpload?.(null);
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxSize: 50 * 1024 * 1024,
        multiple: false,
        onDrop: handleFileUpload,
        onDropRejected: (fileRejections) => {
            const error = fileRejections[0]?.errors[0];
            if (error) {
                setError(
                    error.code === 'file-too-large' 
                        ? 'File size exceeds the 50MB limit. Please optimize your content and try again.'
                        : error.message
                );
            }
        }
    });

    const displayError = externalError || error;

    return (
        <div className="w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Upload Product File</h2>
            
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
                        {!file ? (
                            <div className="text-center space-y-4">
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
                                        {isDragActive ? "Drop to upload" : "Upload Product File"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Drag and drop or click to select
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Maximum file size: 50MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full"
                            >
                                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                                            <IconUpload className="w-5 h-5 text-[#EE519F]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                                    >
                                        <IconX className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
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

export default FileUpload;