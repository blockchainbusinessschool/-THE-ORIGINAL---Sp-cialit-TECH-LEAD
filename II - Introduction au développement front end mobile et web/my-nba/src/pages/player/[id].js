import Head from "next/head";
import Layout from "@/components/layout/Layout";
import PlayerDetails from "@/components/players/PlayerDetails";
import { Box, Stack } from "@mui/material";
import Web3Module from "@/components/web3/Web3Module";

function Players({ player }) {
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
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          direction={"row"}
        >
          <Box display={"flex"} flex={1} mr={5}>
            <PlayerDetails player={player} />
          </Box>
          <Box display={"flex"} flex={2}>
            <Web3Module />
          </Box>
        </Box>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(
      `https://www.balldontlie.io/api/v1/players/${params.id}`
    );
    const player = await res.json();
    return {
      props: {
        player,
      },
    };
  } catch (err) {
    return {
      props: {
        player: null,
      },
    };
  }
}

export async function getStaticPaths() {
  try {
    const res = await fetch("https://www.balldontlie.io/api/v1/players");
    const players = await res.json();
    return {
      fallback: true,
      paths: players.data.map((player) => ({
        params: { id: `${player.id}` },
      })),
    };
  } catch (err) {
    console.error(err.message);
    return {
      fallback: true,
      paths: [],
    };
  }
}

export default Players;
