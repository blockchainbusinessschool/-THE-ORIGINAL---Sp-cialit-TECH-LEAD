import Head from "next/head";
import { Inter } from "next/font/google";
import { Container } from "@mui/material";
import LoginForm from "@/components/login/LoginForm";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  return (
    <>
      <Head>
        <title>My NBA</title>
        <meta
          name="description"
          content="An app to post messages to NBA players"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        className={inter.className}
        sx={{ display: "flex", height: "100vh" }}
      >
        <LoginForm />
      </Container>
    </>
  );
}
