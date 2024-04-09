import {
  Button,
  Divider,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { parseEther, stringToHex } from "viem";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { useDebounce } from "use-debounce";

const amount = "0.005";
const recipient = "0x6Cc9397c3B38739daCbfaA68EaD5F5D77Ba5F455";

export default function PostsList() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const { isConnected } = useAccount();
  const [debouncedTo] = useDebounce(recipient, 500);
  const [debouncedAmount] = useDebounce(amount, 500);
  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    data: stringToHex(message, { size: 32 }),
  });
  const { data, sendTransaction } = useSendTransaction(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      postMessage(data);
    },
    onError(error) {
      console.error(error.message);
    },
  });

  function postMessage(data) {
    console.log(data);
    setPosts([...posts, { message, hash: data.transactionHash }]);
    setMessage("");
  }

  function handleClick() {
    if (message !== "") {
      sendTransaction?.();
    }
  }

  return (
    isConnected && (
      <Stack mt={5} spacing={5} flex={1}>
        <Stack spacing={1} divider={<Divider flexItem variant="middle" />}>
          {posts.map((post) => (
            <Fragment key={post.hash}>
              <ListItem>
                <ListItemText
                  primary={post.message}
                  secondary={
                    <Link
                      target="_blank"
                      href={`https://sepolia.etherscan.io/tx/${post.hash}`}
                    >
                      <Typography variant="caption">
                        Voir la transaction Etherscan
                      </Typography>
                    </Link>
                  }
                ></ListItemText>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </Stack>

        <Stack>
          <TextField
            multiline
            rows={4}
            label="Votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleClick} disabled={isLoading || !message}>
            {isLoading ? "En cours d'envoi..." : "Envoyer (0.05 SEP ETH)"}
          </Button>
        </Stack>
      </Stack>
    )
  );
}
