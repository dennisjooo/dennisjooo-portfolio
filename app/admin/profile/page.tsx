"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="space-y-6 max-w-md">
        <div className="border rounded-lg p-6 space-y-4">
          <label className="block text-sm font-medium">Profile Picture</label>
          
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-muted">
            {imageUrl && (
                <Image 
                src={imageUrl} 
                alt="Profile" 
                fill 
                className="object-cover"
                unoptimized={imageUrl.startsWith('http')} // Optimization requires config
                />
            )}
          </div>

          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
          {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}
