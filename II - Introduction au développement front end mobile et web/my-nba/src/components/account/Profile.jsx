import { UserContext } from "@/context/userContext";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useContext } from "react";

export default function Profile() {
  const user = useContext(UserContext);
  return (
    <Box>
      {user.isConnected && (
        <>
          <Box marginBottom={2}>
            <Typography>Utilisateur : {user.username}</Typography>
          </Box>
          <Image
            src={user.avatarUrl}
            alt={"Avatar Player"}
            width={200}
            height={200}
            style={{ borderRadius: "100px" }}
          />
        </>
      )}
    </Box>
  );
}
