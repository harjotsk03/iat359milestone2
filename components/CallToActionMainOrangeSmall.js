import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const CallToActionMainOrangeSmall = ({
  text,
  onClick,
  icon,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onClick}
      disabled={disabled}
    >
      {icon && <Text style={styles.text}>{icon}</Text>}
      {text && <Text style={styles.text}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF8C00", // Replace with your mainColorLightOrange value
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
});
