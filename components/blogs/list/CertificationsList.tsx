import { certifications } from '@/data/certificationContent';
import { CertificationCard } from './CertificationCard';

export default function CertificationsList() {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {certifications.map((cert, index) => (
                <CertificationCard 
                    key={cert.id} 
                    certification={cert}
                    index={index}
                />
            ))}
        </div>
    );
}