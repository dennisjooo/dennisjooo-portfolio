'use client';

import { useEffect, useState } from 'react';
import { CertificationCard, Certification } from './CertificationCard';

export default function CertificationsList() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await fetch('/api/certifications');
                const data = await res.json();
                if (data.success) {
                    setCertifications(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch certifications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCerts();
    }, []);

    if (loading) {
        return <div className="text-center py-20">Loading certifications...</div>;
    }

    if (certifications.length === 0) {
        return <div className="text-center py-20 text-muted-foreground">No certifications found.</div>;
    }

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {certifications.map((cert, index) => (
                <CertificationCard 
                    key={cert._id} 
                    certification={cert}
                    index={index}
                />
            ))}
        </div>
    );
}
