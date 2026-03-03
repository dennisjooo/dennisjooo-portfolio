"use client";

import WorkExperienceForm from '@/components/admin/WorkExperienceForm';
import { createAdminNewPage } from '@/components/admin/factories';
import type { WorkExperience } from '@/lib/db';

export default createAdminNewPage<WorkExperience>({
  endpoint: '/api/work-experience',
  redirectTo: '/admin/work-experience',
  itemName: 'work experience',
  FormComponent: WorkExperienceForm,
  title: { accent: 'Experience', subtitle: 'Add a new position or education entry' },
});
