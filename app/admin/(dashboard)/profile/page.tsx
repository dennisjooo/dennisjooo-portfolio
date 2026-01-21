"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CameraIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ProfileAdminPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        setImageUrl(data.profileImageUrl || '/images/profile.webp');
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      // 1. Upload to Blob
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = await response.json();

      // 2. Update DB
      await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImageUrl: newBlob.url }),
      });

      setImageUrl(newBlob.url);
      // Optional: Add a toast notification here
      alert('Profile updated!'); 
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair italic text-3xl md:text-4xl text-foreground">
            Profile <span className="not-italic font-sans font-bold">Settings</span>
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Global configuration & identity
        </p>
      </div>
      
      <div className="glass-panel p-8 rounded-2xl max-w-2xl border border-border/50">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Preview */}
            <div className="relative group">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
                    {imageUrl && (
                        <Image 
                        src={imageUrl} 
                        alt="Profile" 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={imageUrl.startsWith('http')} 
                        />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
                
                {/* Upload Button Overlay */}
                <label 
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 p-3 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors group-hover:scale-110"
                >
                    <CameraIcon className="w-5 h-5" />
                    <input 
                        id="profile-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            <div className="flex-1 space-y-4">
                <h3 className="text-xl font-bold font-urbanist">Profile Picture</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    This image will be displayed on your homepage and navigation bar. 
                    Recommended size: 500x500px. JPG, PNG or WebP.
                </p>
                
                <div className="pt-4 border-t border-border/50">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Current Source</h4>
                    <code className="block w-full p-3 bg-muted/50 rounded-lg text-xs font-mono text-muted-foreground break-all border border-border/50">
                        {imageUrl}
                    </code>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
