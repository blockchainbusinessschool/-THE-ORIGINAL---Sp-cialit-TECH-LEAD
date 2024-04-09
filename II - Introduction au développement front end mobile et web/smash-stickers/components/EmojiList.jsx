import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet } from "react-native";

export default function EmojiList({ onSelect, onCloseModal }) {
  const [emoji] = useState([
    require("../assets/emoji1.png"),
    require("../assets/emoji2.jpeg"),
    require("../assets/emoji3.png"),
  ]);

  function renderItem({ item, index }) {
    return (
      <Pressable
        onPress={() => {
          onSelect(item);
          onCloseModal();
        }}
      >
        <Image source={item} key={index} style={styles.image} />
      </Pressable>
    );
  }

  return (
    <FlatList
      horizontal
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
});
