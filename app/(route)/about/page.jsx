'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-black px-4 sm:px-8 md:px-32 lg:px-36 py-12">
      <div className="max-w-7xl mx-auto text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">About Us</h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-12 text-center">
          Welcome to SellBetter! We are dedicated to providing the best platform for selling digital products. Our mission is to support creators and help them reach their audience with ease. Whether you are a beginner or a seasoned seller, we offer tools and resources to make your selling experience smooth and successful.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="bg-gray-800 transition-shadow hover:shadow-xl">
              <CardHeader>
                <Sparkles className="w-8 h-8 text-pink-500" />
                <CardTitle className="text-2xl text-white mt-4">Our Mission</CardTitle>
                <CardDescription className="text-gray-400 mt-2">Empowering creators to succeed</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300 mt-4">
                <p>
                  Our mission is to empower creators by providing them with the tools and resources they need to succeed in their digital product sales.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="bg-gray-800 transition-shadow hover:shadow-xl">
              <CardHeader>
                <Users className="w-8 h-8 text-pink-500" />
                <CardTitle className="text-2xl text-white mt-4">Our Team</CardTitle>
                <CardDescription className="text-gray-400 mt-2">Passionate and dedicated</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300 mt-4">
                <p>
                  Our team consists of passionate and dedicated professionals who are committed to helping you achieve your goals.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="bg-gray-800 transition-shadow hover:shadow-xl">
              <CardHeader>
                <Shield className="w-8 h-8 text-pink-500" />
                <CardTitle className="text-2xl text-white mt-4">Our Promise</CardTitle>
                <CardDescription className="text-gray-400 mt-2">Trust and security</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300 mt-4">
                <p>
                  We promise to provide a secure and trustworthy platform where you can confidently sell your digital products.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <div className="mt-12 flex justify-center">
          <Button variant="primary" className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg">
            Join Us Today
          </Button>
        </div>
      </div>
    </div>
  );
}