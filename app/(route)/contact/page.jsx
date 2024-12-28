'use client';
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Contact() {
  return (
    <div className="min-h-screen bg-black px-4 sm:px-8 md:px-32 lg:px-36 py-12">
      <div className="max-w-7xl mx-auto text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-8 text-center">
          Have any questions or need support? Feel free to reach out to us. We are here to help you with anything you need.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image - Hidden on small screens */}
          <div className="hidden lg:flex justify-center items-center">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" // Pexels image URL for demonstration
              alt="Professional"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          {/* Contact Information */}
          <div>
            <Card className="bg-gray-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-white mt-4">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 mt-4">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-pink-500 mr-2" />
                  <div>
                    <p className="text-lg text-white">Email Us</p>
                    <p className="text-gray-400">contact@sellbetter.com</p>
                    <p className="text-gray-400">Feel free to email us with any questions or concerns at contact@sellbetter.com.</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-pink-500 mr-2" />
                  <div>
                    <p className="text-lg text-white">Call Us</p>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-400">You can call us at +1 (555) 123-4567 for immediate assistance.</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-pink-500 mr-2" />
                  <div>
                    <p className="text-lg text-white">Visit Us</p>
                    <p className="text-gray-400">123 SellBetter St, Digital City</p>
                    <p className="text-gray-400">Come visit us at our office located at 123 SellBetter St, Digital City.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}