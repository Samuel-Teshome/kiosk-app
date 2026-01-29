import atiLogoImg from "@/assets/images/ati-logo.png";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { ColorBar3 } from "./ColorBar";

const HeaderBar = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 480;
  const isTablet = width >= 480 && width < 1024;
  const isDesktop = width >= 1024;
  const scaleFont = (size) => (width / 375) * size;
  const colorScheme = useColorScheme();
  const [atLeastOneUser, setAtLeastOneUser] = useState();

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  console.log("API URL: ", BASE_URL);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <View>
      <View
        style={{
          //   flexDirection: isMobile ? "row" : "column",
          //   alignItems: "center",
          //   justifyContent: "center",
          //   position: "relative",
          //   width: "100%",
          //   paddingHorizontal: 16,
          marginBottom: isMobile ? 0 : 10,
        }}
      >
        <View
          style={{
            // flexDirection: "row",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 0 : 20,
            // borderWidth: 1,
            // alignItems: "center",
            // gap: 150,
          }}
        >
          <Image
            alt="App Logo"
            // contentFit="contain"
            // style={[styles.headerImg, { height: 150 }]}
            // resizeMode="contain"
            style={[
              styles.headerImg,
              {
                width: "100%",
                maxWidth: 250,
                height: 100,
              },
            ]}
            source={atiLogoImg}
          />
          <Text
            style={[
              styles.headerText,
              {
                color: colorScheme === "dark" ? "white" : "#102714",
                // fontSize: scaleFont(20),
              },
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
            alignSelf: "flex-end",
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
      <ColorBar3 />
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
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
});
