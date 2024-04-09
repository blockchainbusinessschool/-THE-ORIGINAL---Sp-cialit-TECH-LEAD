import { Button, Stack, Typography } from "@mui/material";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import MessagesList from "./PostsList";

export default function Web3Module() {
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected, address, status } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const label = isConnected ? "Se déconnecter" : "Me connecter à mon wallet";

  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }

  function handleClick() {
    if (isConnected) {
      disconnect();
    } else {
      onOpen();
    }
  }

  return (
    <Stack
      flex={1}
      direction={"row"}
      spacing={3}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack spacing={2}>
        {isConnected && (
          <>
            <Typography>Status : {status}</Typography>
            <Typography>Compte : {address}</Typography>
            <Typography>
              Balance : {balance?.formatted} {balance?.symbol}
            </Typography>
          </>
        )}
        <Button onClick={handleClick} variant="contained" disabled={loading}>
          {loading ? "Chargement..." : label}
        </Button>
      </Stack>
      <MessagesList />
    </Stack>
  );
}
