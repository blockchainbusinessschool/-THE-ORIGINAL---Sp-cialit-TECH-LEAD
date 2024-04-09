import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function PlayersList({ players, totalPages }) {
  const router = useRouter();
  function handleChange(e, page) {
    router.push(`/players/${page}`);
  }
  function handleClick(id) {
    router.push(`/player/${id}`);
  }

  return (
    players && (
      <Box>
        <Pagination
          count={totalPages}
          color="primary"
          onChange={handleChange}
        />
        <List>
          {players.data.map((player) => (
            <Fragment key={player.id}>
              <ListItem
                onClick={() => handleClick(player.id)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#eee",
                  },
                }}
              >
                <ListItemText
                  primary={player.first_name + " " + player.last_name}
                  secondary={player.team.full_name}
                ></ListItemText>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Box>
    )
  );
}
