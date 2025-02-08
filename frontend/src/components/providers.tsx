'use client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
