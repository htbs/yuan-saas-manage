"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { redirect } from 'next/navigation';
import { useAuth } from "@src/features/auth/hooks/useAuth";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return null;
}
