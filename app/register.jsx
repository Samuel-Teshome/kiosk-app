import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Feather } from "@expo/vector-icons";
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

const Register = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme.colorScheme === "dark";
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
  });

  const BASE_URL =
    process.env.NODE_ENV !== "production"
      ? `http://localhost:3000`
      : "http://kiosk.ati.gov.et:3000";

  const [secure, setSecure] = useState(true);

  const registerUser = async () => {
    var url = `${BASE_URL}/api/register`;

    if (form.fullName == "") {
      if (Platform.OS === "web") {
        toast.error("Please Enter your Full Name");
      } else {
        Alert.alert("No data", "Please Enter your Full Name");
      }
      return;
    }

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
      <View style={styles.servicesCard}>
        <View style={{ alignItems: "center" }}>
          <ThemedText type="title">Registration</ThemedText>
        </View>
        <View
          style={[
            styles.input,
            {
              alignItems: "center",
            },
          ]}
        >
          {/* Full Name */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: "OutFit",
                  color: isDark ? "#fff" : "#615542",
                }}
              >
                Full Name
              </Text>
              <Text
                style={{
                  fontFamily: "OutFit",
                  color: isDark ? "#fcf7f8" : "#82051e",
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
                onChangeText={(fullName) => setForm({ ...form, fullName })}
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
                value={form.fullName}
              />
            </View>
          </View>

          {/* User Name */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily: "OutFit",
                  color: isDark ? "#fff" : "#615542",
                }}
              >
                Username
              </Text>
              <Text
                style={{
                  fontFamily: "OutFit",
                  color: isDark ? "#fcf7f8" : "#82051e",
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
                  color: isDark ? "#fff" : "#615542",
                }}
              >
                Password
              </Text>
              <Text
                style={{
                  fontFamily: "OutFit",
                  color: isDark ? "#fcf7f8" : "#82051e",
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
                  color={secure ? "gray" : isDark ? "gray" : "#615542"}
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
            <TouchableOpacity onPress={() => registerUser()}>
              <View
                style={[
                  styles.btn,
                  { opacity: colorScheme === "dark" ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.btnText}>Submit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // router.back();
                router.back();
              }}
            >
              <View
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      colorScheme === "dark"
                        ? "#A1A1A3"
                        : "rgba(97, 85, 66, 0.74)",
                  },
                ]}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    // alignItems: "center",
    gap: 20,
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginTop: 50,
  },
  servicesCard: {
    // height: 300,
    width: "50%",
    backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
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
    backgroundColor: "rgba(19, 143, 73, 0.74)",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "OutFitBold",
    color: "#ffffff",
  },
});
