// src/app/providers.tsx
"use client"; // This component is a Client Component

import { ReactNode } from 'react';
import { UserContextProvider } from './contextlibrary'; // Import your context provider


interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Wrap all your client-side contexts here
  return (
    <UserContextProvider>
      {/* Add other client-side providers here if you have them */}
      {children}
    </UserContextProvider>
  );
}