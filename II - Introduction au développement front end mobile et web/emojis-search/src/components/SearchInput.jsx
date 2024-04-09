import { Box, TextField } from "@mui/material";

export default function SearchInput({ handleChange }) {
  function handleOnChange(e) {
    handleChange(e.target.value);
  }

  return (
    <Box>
      <TextField
        onChange={handleOnChange}
        fullWidth
        label="Rechercher un emoji"
      />
    </Box>
  );
}
