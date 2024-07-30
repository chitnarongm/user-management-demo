"use client";
import { SessionProvider } from "next-auth/react";
import { FunctionComponent, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

export const CustomProviders: FunctionComponent<ProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
