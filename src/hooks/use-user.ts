
"use client";

import { useState, useEffect } from 'react';
import { type User } from '@/lib/data';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUser(null);
    }
  }, []);

  return user;
}
