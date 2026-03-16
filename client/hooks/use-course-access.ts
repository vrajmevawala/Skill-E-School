/**
 * Hook to check if user has access to course content
 * Returns whether user is enrolled and can view lessons/resources
 */

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { CourseAccessResponse } from '@shared/api';

export function useCourseAccess(courseId: string | undefined) {
  const [access, setAccess] = useState<CourseAccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!courseId || !token) {
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`[useCourseAccess] Checking access for course: ${courseId}`);
        
        const response = await api.get(`/courses/${courseId}/access`, token);
        setAccess(response);
        
        console.log(`[useCourseAccess] Access result:`, {
          canAccess: response.canAccessContent,
          isEnrolled: response.isEnrolled,
          enrollmentStatus: response.enrollmentStatus
        });
      } catch (err: any) {
        console.error(`[useCourseAccess] Error:`, err);
        setError(err.message || 'Failed to check course access');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [courseId, token]);

  return { access, loading, error };
}
