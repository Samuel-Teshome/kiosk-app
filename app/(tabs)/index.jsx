import atiLogoImg from "@/assets/images/ati-logo.png";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
} from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [atLeastOneUser, setAtLeastOneUser] = useState();

  const BASE_URL =
    process.env.NODE_ENV !== "production"
      ? `http://localhost:3000`
      : "http://kiosk.ati.gov.et:3000";

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
      <View
        style={[
          styles.header,
          {
            backgroundColor: colorScheme === "dark" ? "#102714" : "white",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 150 }}
          >
            <Image
              alt="App Logo"
              contentFit="contain"
              style={styles.headerImg}
              source={atiLogoImg}
            />
            <Text
              style={[
                styles.headerText,
                { color: colorScheme === "dark" ? "white" : "#102714" },
              ]}
            >
              Digital Kiosk
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              flexDirection: "row",
              gap: 20,
            }}
          >
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <MaterialCommunityIcons
                name="database-cog-outline"
                size={24}
                color="black"
                style={{ opacity: "0.5" }}
              />
            </TouchableOpacity>
            {!atLeastOneUser && (
              <TouchableOpacity onPress={() => router.push("/register")}>
                <FontAwesome
                  name="user-plus"
                  size={24}
                  color="black"
                  style={{ opacity: "0.5" }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.servicesCardContainer}>
        {services.map((service) => (
          <View key={service.id} style={styles.servicesCard}>
            <Text style={styles.serviceName}>{service.displayName}</Text>
            <Image
              alt="App Logo"
              contentFit="contain"
              style={[styles.headerImg, { height: 350 }]}
              source={{ uri: service.imageUrl }}
            />
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
                  {service.url.length > 40
                    ? service.url.substring(0, 40) + "..."
                    : service.url}
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
    height: 178,
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
    height: 178,
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
