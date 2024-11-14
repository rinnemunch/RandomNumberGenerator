import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { DeviceMotion } from "expo-sensors";

const themes = [
  {
    name: "Light",
    backgroundColor: "#fff",
    textColor: "#000",
    buttonColor: "#4A90E2",
  },
  {
    name: "Dark",
    backgroundColor: "#121212",
    textColor: "#fff",
    buttonColor: "#333",
  },
  {
    name: "Ocean",
    backgroundColor: "#E0F7FA",
    textColor: "#00796B",
    buttonColor: "#004D40",
  },
];

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const spinValue = useRef(new Animated.Value(0)).current;

  const generateRandomNumber = () => {
    const randomNum = Math.floor(
      Math.random() * (maxNumber - minNumber + 1) + minNumber
    );
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setRandomNumber(randomNum);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[
          styles.container,
          { backgroundColor: selectedTheme.backgroundColor },
        ]}
      >
        <View style={styles.settingsButton}>
          <Text
            style={[styles.settingText, { color: selectedTheme.textColor }]}
            onPress={() => setSettingsVisible(true)}
          >
            ⚙️
          </Text>
        </View>

        <View style={styles.centeredContent}>
          <Pressable
            style={styles.numberContainer}
            onPress={generateRandomNumber}
          >
            <Animated.Text
              style={[
                styles.numberDisplay,
                {
                  color: selectedTheme.textColor,
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              {randomNumber}
            </Animated.Text>
            <Text style={[styles.message, { color: selectedTheme.textColor }]}>
              Tap or shake for a random number
            </Text>
          </Pressable>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={settingsVisible}
          onRequestClose={() => setSettingsVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor:
                    selectedTheme.name === "Dark" ? "#333" : "#fff",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSettingsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text
                style={[styles.modalText, { color: selectedTheme.textColor }]}
              >
                Settings
              </Text>
              <Text style={[styles.label, { color: selectedTheme.textColor }]}>
                Minimum Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: selectedTheme.textColor,
                    backgroundColor:
                      selectedTheme.name === "Dark" ? "#333" : "#fff",
                  },
                ]}
                keyboardType="number-pad"
                value={String(minNumber)}
                onFocus={() => setMinNumber("")}
                onBlur={() =>
                  setMinNumber((prev) =>
                    prev === "" ? 1 : Math.max(1, parseInt(prev))
                  )
                }
                onChangeText={(text) => setMinNumber(text)}
              />
              <Text style={[styles.label, { color: selectedTheme.textColor }]}>
                Maximum Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: selectedTheme.textColor,
                    backgroundColor:
                      selectedTheme.name === "Dark" ? "#333" : "#fff",
                  },
                ]}
                keyboardType="number-pad"
                value={String(maxNumber)}
                onFocus={() => setMaxNumber("")}
                onBlur={() =>
                  setMaxNumber((prev) =>
                    prev === "" ? 100 : Math.min(100, parseInt(prev))
                  )
                }
                onChangeText={(text) => setMaxNumber(text)}
              />
              <Text style={[styles.label, { color: selectedTheme.textColor }]}>
                Select Theme
              </Text>
              <View style={styles.themeContainer}>
                {themes.map((theme) => (
                  <Pressable
                    key={theme.name}
                    style={[
                      styles.themeButton,
                      {
                        backgroundColor:
                          selectedTheme.name === theme.name
                            ? theme.buttonColor
                            : theme.backgroundColor,
                      },
                    ]}
                    onPress={() => setSelectedTheme(theme)}
                  >
                    <Text
                      style={[
                        styles.themeButtonText,
                        {
                          color:
                            selectedTheme.name === theme.name
                              ? theme.textColor
                              : theme.buttonColor,
                        },
                      ]}
                    >
                      {theme.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20,
  },
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  numberDisplay: {
    fontSize: 100,
    textAlign: "center",
    marginVertical: 20,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 15,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
