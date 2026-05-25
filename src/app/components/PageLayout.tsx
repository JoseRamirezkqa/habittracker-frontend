import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-2xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}