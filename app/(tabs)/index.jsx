import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
// import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import HeaderBar from "../../components/HeaderBar";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 480;
  const [atLeastOneUser, setAtLeastOneUser] = useState();

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  // console.log("BASE URL:", BASE_URL);
  // const API = window.location.hostname.includes("192.168.10")
  // ? "http://192.168.10.10:3000"
  // : "http://localhost:8000";
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  console.log("API URL: ", BASE_URL);

  // List of IP addresses and hostnames to check
  // const validHosts = ["192.168.10", "localhost"];

  // const BASE_URL = validHosts.some((host) => hostname.includes(host))
  // ? `http://${hostname}:${port}` // Your API URL for valid hosts
  // : hostname.includes("10.3")
  // ? "http://`${hostname}`:3000"
  // : "http://kiosk.ati.gov.et:3000"; // Fallback or production API

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Don't know how to open URI: ${url}`);
    }
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // "http://localhost:3000/api/api/services"
  useEffect(() => {
    fetch(`${BASE_URL}/api/services`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        for (const item of json) {
          var url = `${BASE_URL}/` + item.imagePath;
          const processed = {
            ...item,
            imageUrl: url,
          };

          setServices((prev) => [...prev, processed]);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });

    fetch(`${BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        if (json.length > 0) {
          setAtLeastOneUser(true);
        } else {
          setAtLeastOneUser(false);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const deleteService = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Record deleted successfully");
      } else {
        console.error("Failed to delete record", response.status);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.servicesCardContainer}>
        {services.map((service) => (
          <View key={service.id} style={styles.servicesCard}>
            <Text style={styles.serviceName}>{service.displayName}</Text>
            <TouchableOpacity onPress={() => openLink(service.url)}>
              <Image
                alt="App Logo"
                contentFit="contain"
                style={[styles.headerImg, { height: 350 }]}
                source={{ uri: service.imageUrl }}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Pressable onPress={() => openLink(service.url)}>
                <ThemedText
                  type="link"
                  style={{ fontFamily: "OutFit", alignItems: "start" }}
                >
                  {service.name.length > 40
                    ? service.name.substring(0, 40) + "..."
                    : service.name}
                </ThemedText>
              </Pressable>
              {/* =========================================== */}
              {/* Can be Used to Remove Services */}
              {/* <Pressable onPress={() => deleteService(service.id)}>
                <MaterialIcons
                  name="delete"
                  size={24}
                  color="red"
                  style={{ opacity: "0.6" }}
                />
              </Pressable> */}
              {/* =========================================== */}
            </View>
          </View>
        ))}
        {services.length == 0 && (
          <Text
            style={[
              styles.headerText,
              {
                color: colorScheme === "dark" ? "white" : "#102714",
                fontSize: isMobile ? 30 : 40,
              },
            ]}
          >
            No content available.
          </Text>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 150,
    width: 350,
    bottom: 0,
    position: "absolute",
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerImg: {
    width: 350,
    height: 150,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "OutFitBold",
    marginVertical: 10,
  },
  servicesCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 20,
  },
  servicesCard: {
    gap: 10,
    backgroundColor: "#F9F9F9",
    marginHorizontal: 30,
    padding: 15,
    borderRadius: 15,
    ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    marginBottom: 30,
  },
  serviceName: {
    fontSize: 25,
    fontFamily: "OutFit",
    color: "#102714",
  },
});
