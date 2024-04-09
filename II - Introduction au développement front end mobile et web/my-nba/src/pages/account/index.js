import Profile from "@/components/account/Profile";
import { Box } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Layout from "@/components/layout/Layout";
import Head from "next/head";

export default function Account() {
  const player = {
    name: "LeBron James",
    avatarUrl:
      "https://ca-times.brightspotcdn.com/dims4/default/0f13f1e/2147483647/strip/true/crop/4937x3292+0+0/resize/1200x800!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F4e%2F4e%2Fba20004c41a5bc970aad01b5739b%2Fhttps-delivery.gettyimages.com%2Fdownloads%2F1199826353.jpg",
  };

  return (
    <>
      <Head>
        <title>Mon compte</title>
        <meta
          name="description"
          content="An app to post messages to NBA players"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Profile />
        </Box>
      </Layout>
    </>
  );
}
