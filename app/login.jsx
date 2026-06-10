import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Feather } from "@expo/vector-icons";
// import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  // console.log("API URL: ", BASE_URL);

  const [secure, setSecure] = useState(true);

  const logIn = async () => {
    var url = `${BASE_URL}/api/login`;

    if (form.userName == "") {
      if (Platform.OS === "web") {
        toast.error("Please Enter your Username");
      } else {
        Alert.alert("No data", "Please Enter your Username");
      }
      return;
    }
    if (form.password == "") {
      if (Platform.OS === "web") {
        toast.error("Please Enter your Password");
      } else {
        Alert.alert("No data", "Please Enter your Password");
      }
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: form }),
      });

      const json = await response.json();

      if (json.error != undefined) {
        if (Platform.OS === "web") {
          toast.error(json.error);
        } else {
          Alert.alert("Error", json.error);
        }
      } else if (json.message != undefined) {
        var msg = json.message;
        if (Platform.OS === "web") {
          toast.success(msg);
        } else {
          Alert.alert("Success", msg);
        }
        router.replace("/admin");
      }
    } catch (err) {
      if (Platform.OS === "web") {
        toast.error("Failed to upload JSON data");
      } else {
        Alert.alert("Error", "Failed to upload JSON data");
      }
    }
  };
  return (
    <ThemedView style={styles.container}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <View
        style={[
          styles.servicesCard,
          {
            backgroundColor: isDark ? "#323232" : "#F9F9F9",
            ShadowColor: isDark ? "white" : "black",
            boxShadow: isDark
              ? "0 4px 8px rgba(255, 255, 255, 0.5)"
              : "0 4px 8px rgba(0, 0, 0, 0.5)",
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
          },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: isDark ? "white" : "#615542",
              fontSize: 32,
              fontWeight: "bold",
              lineHeight: 32,
            }}
          >
            Login
          </Text>
        </View>
        <View
          style={[
            styles.input,
            {
              alignItems: "center",
            },
          ]}
        >
          {/* User Name */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: "OutFit",
                  color: isDark ? "white" : "#615542",
                }}
              >
                Username
              </Text>
              <Text
                style={{
                  fontFamily: "OutFit",
                  color: isDark ? "white" : "#82051e",
                }}
              >
                {" "}
                *
              </Text>
            </View>

            <View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(userName) => setForm({ ...form, userName })}
                style={{
                  height: 40,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: "#C9D3DB",
                  fontSize: 15,
                  fontWeight: "500",
                  fontFamily: "OutFit",
                  backgroundColor: isDark ? "transparent" : "#fff",
                  color: isDark ? "white" : "#585858",
                }}
                value={form.userName}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: "OutFit",
                  color: isDark ? "white" : "#615542",
                }}
              >
                Password
              </Text>
              <Text
                style={{
                  fontFamily: "OutFit",
                  color: isDark ? "white" : "#82051e",
                }}
              >
                {" "}
                *
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="**********"
                secureTextEntry={secure}
                onChangeText={(password) => setForm({ ...form, password })}
                style={{
                  height: 40,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: "#C9D3DB",
                  fontSize: 15,
                  fontWeight: "500",
                  fontFamily: "OutFit",
                  backgroundColor: isDark ? "transparent" : "#fff",
                  color: isDark ? "white" : "#585858",
                }}
                value={form.password}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 4, top: 11 }}
                onPress={() => setSecure(!secure)}
              >
                <Feather
                  name={secure ? "eye-off" : "eye"}
                  size={16}
                  color={secure ? "gray" : isDark ? "white" : "#615542"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.input,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 40,
              },
            ]}
          >
            <TouchableOpacity onPress={() => logIn()}>
              <View
                style={[
                  styles.btn,
                  {
                    opacity: isDark ? 0.8 : 1,
                    backgroundColor: isDark ? "#333333" : "#138f49",
                    borderWidth: 1,
                    borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                  },
                ]}
              >
                <Text style={styles.btnText}>Submit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // router.back();
                router.replace("/");
              }}
            >
              <View
                style={[
                  styles.btn,
                  {
                    backgroundColor: isDark ? "" : "#615542",
                    borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.btnText,
                    { fontFamily: isDark ? "OutFit" : "OutFitBold" },
                  ]}
                >
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    // alignItems: "center",
    // gap: 20,
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginTop: 50,
  },

  servicesCard: {
    height: 300,
    width: 300,
    // backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    // ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    marginBottom: 30,
    alignSelf: "center",
    gap: 20,
  },
  input: {
    marginBottom: 16,
  },
  /** Button */
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    // backgroundColor: "rgba(19, 143, 73, 0.74)",
    // border-[#e2e0d8] dark:border-[#5e5e5a] bg-[#138f49] dark:bg-[#333333]
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "OutFitBold",
    color: "#ffffff",
  },
});
