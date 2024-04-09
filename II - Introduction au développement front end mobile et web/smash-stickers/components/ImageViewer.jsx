import { Image, StyleSheet } from "react-native";

export default function ImageViewer({ placeHolderImageSource, selectedImage }) {
  const imageSource =
    selectedImage !== null ? { uri: selectedImage } : placeHolderImageSource;
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 400,
    borderRadius: 15,
  },
});
