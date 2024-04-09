import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ClipboardJS from "clipboard";

export default function EmojisResults({ emojis }) {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-to-clipboard");
    clipboard.on("success", function (e) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
      e.clearSelection();
    });
    return () => {
      clipboard.destroy();
    };
  }, []);

  return (
    <Box>
      <List>
        {emojis.map((emoji, index) => (
          <Fragment key={index}>
            <ListItem
              className="copy-to-clipboard"
              data-clipboard-text={emoji.emoji}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#eee",
                  "& > .MuiListItemText-root": {
                    display: "flex",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "#000000" }}>
                {emoji.emoji}
              </ListItemIcon>
              <ListItemText>{emoji.description}</ListItemText>
              <ListItemText
                sx={{
                  color: "#ccc",
                  display: "none",
                  justifyContent: "flex-end",
                }}
              >
                {isCopied ? "Texte copié !" : "Cliquer pour copier"}
              </ListItemText>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
