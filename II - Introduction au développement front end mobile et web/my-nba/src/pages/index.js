import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { Box, Typography } from "@mui/material";

export default function Home() {
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
      <Layout>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography variant="h3">Bienvenue !</Typography>
        </Box>
      </Layout>
    </>
  );
}
