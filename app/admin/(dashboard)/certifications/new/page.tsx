"use client";

import CertificationForm from '@/components/admin/CertificationForm';
import { createAdminNewPage } from '@/components/admin/factories';
import type { Certification } from '@/lib/db';

export default createAdminNewPage<Certification>({
  endpoint: '/api/certifications',
  redirectTo: '/admin/certifications',
  itemName: 'certification',
  FormComponent: CertificationForm,
  title: { accent: 'Certification', subtitle: 'Add a new credential or achievement' },
});
