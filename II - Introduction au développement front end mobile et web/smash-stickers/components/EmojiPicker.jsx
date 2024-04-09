import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function EmojiPicker({ isVisible, children, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choisissez un sticker</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "25%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#25292e",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    color: "#fff",
  },
});
