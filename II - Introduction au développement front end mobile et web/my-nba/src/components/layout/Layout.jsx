import * as React from "react";
import { Inter } from "next/font/google";
import { Box, Container } from "@mui/material";
import MainNav from "./MainNav";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <Box>
      <MainNav />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flex: 1,
        }}
        component="main"
      >
        <Container display={"flex"} flex={1}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
