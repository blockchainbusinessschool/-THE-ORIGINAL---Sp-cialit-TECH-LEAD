import { useContext } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { UserDispatchContext } from "@/context/userContext";
import Link from "next/link";

export const APP_BAR_HEIGHT = 80;

export default function MainNav() {
  const dispatch = useContext(UserDispatchContext);
  const pages = [
    { title: "Joueurs NBA", url: "/players/1" },
    { title: "Mon compte", url: "/account" },
  ];

  function handleOnClick() {
    dispatch({
      type: "logout",
    });
  }

  return (
    <Box height={APP_BAR_HEIGHT}>
      <AppBar position="static">
        <Toolbar>
          <Box>
            <Link href={"/"}>
              <Button variant={"text"} sx={{ color: "white" }}>
                <Typography variant="h6">My NBA</Typography>
              </Button>
            </Link>
          </Box>
          <Box display={"flex"} flex={1} marginLeft={10}>
            {pages.map((page) => (
              <Link href={page.url} key={page.url}>
                <Button variant={"text"} sx={{ color: "white" }}>
                  {page.title}
                </Button>
              </Link>
            ))}
          </Box>
          <Button variant="contained" color="error" onClick={handleOnClick}>
            Se déconnecter
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
