import { UserDispatchContext } from "@/context/userContext";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function LoginForm() {
  const dispatch = useContext(UserDispatchContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleOnClick() {
    let credentials = { email, password };
    fetch("/api/login", { method: "POST", body: JSON.stringify(credentials) })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Identifiants invalides");
        }
        return response.json();
      })
      .then((user) => {
        dispatch({ type: "login", user });
        router.push("/");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setOpen(true);
      });
  }

  return (
    <>
      <Box
        display={"flex"}
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Typography variant="h1">Connexion</Typography>
        <Stack spacing={2} sx={{ width: "50%" }}>
          <TextField
            label="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleOnClick}>
            Se connecter
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
