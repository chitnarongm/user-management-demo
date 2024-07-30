"use client";
import { Suspense, type ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import { CustomProviders } from "./provider";
import "./styles/globals.css";
import styles from "./styles/layout.module.css";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <main className={styles.main}>
          <Suspense fallback={<Loading />}>
            <CustomProviders>
              <StoreProvider>
                <CssBaseline />
                <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: "top", horizontal: "right" }} />
                <Navbar />
                {children}
              </StoreProvider>
            </CustomProviders>
          </Suspense>
        </main>
      </body>
    </html>
  );
}
