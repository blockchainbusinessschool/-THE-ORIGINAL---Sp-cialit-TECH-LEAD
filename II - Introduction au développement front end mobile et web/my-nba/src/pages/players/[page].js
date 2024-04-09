import Head from "next/head";
import Layout from "@/components/layout/Layout";
import PlayersList from "@/components/players/PlayersList";

function Players({ players, totalPages }) {
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
        <PlayersList players={players} totalPages={totalPages} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(
      `https://www.balldontlie.io/api/v1/players?page=${params.page}`
    );
    const players = await res.json();
    const totalPages = players.meta.total_pages;

    return {
      props: {
        players,
        totalPages,
      },
    };
  } catch (err) {
    return {
      props: {
        players: { data: [] },
        totalPages: 1,
      },
    };
  }
}

export async function getStaticPaths() {
  try {
    const res = await fetch("https://www.balldontlie.io/api/v1/players");
    const players = await res.json();
    const totalPages = players.meta.total_pages;

    return {
      fallback: true,
      paths: Array.from(Array(totalPages).keys()).map((page) => ({
        params: { page: `${page}` },
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
