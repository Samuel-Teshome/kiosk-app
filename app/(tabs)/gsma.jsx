import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import Constants from "expo-constants";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import HeaderBar from "../../components/HeaderBar";
export default function Gsma() {
  const colorScheme = useColorScheme();

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  console.log("API URL: ", BASE_URL);

  const [contents, setContents] = useState([]);
  const [amharicTitle, setAmharicTitle] = useState("");
  const [englishTitle, setEnglishTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const fetchConents = async (nextPage = 1) => {
    if (nextPage > totalPages) return;
    const limit = 10;
    fetch(`${BASE_URL}/api/gsma?page=${nextPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setPage(nextPage);
        setTotalPages(json.totalPages);
        for (const item of json.data) {
          var fileUrl = `${BASE_URL}/` + item.filePath;
          var imageUrl = `${BASE_URL}/` + item.thumbNailPath;
          const processed = {
            ...item,
            fileUrl: fileUrl,
            imageUrl: imageUrl,
          };
          setContents((prev) => [...prev, processed]);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  };

  const fetchMore = () => {
    if (!loading && page < totalPages) {
      fetchConents(page + 1);
    }
  };

  useEffect(() => {
    fetchConents();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <HeaderBar />
      <FlatList
        data={contents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesCardContainer}
        renderItem={({ item: content }) => (
          <View style={styles.servicesCard}>
            <View style={{ gap: 10 }}>
              <Text
                style={[styles.serviceName, { color: "#009147" }]}
                numberOfLines={1}
              >
                {content.titleAmharic}
              </Text>
              <Text
                style={[styles.serviceName, { color: "#91AC34" }]}
                numberOfLines={1}
              >
                {content.titleEnglish}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPlayerVisible(true);
                setAmharicTitle(content.titleAmharic);
                setEnglishTitle(content.titleEnglish);
                setPdfUrl(`${BASE_URL}/${content.filePath}`);
                console.log(`${BASE_URL}/${content.filePath}`);
              }}
            >
              <Image
                alt="App Logo"
                contentFit="contain"
                style={[styles.headerImg, { height: 200, width: 200 }]}
                source={{ uri: content.imageUrl }}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                flexWrap: "wrap",
                position: "absolute",
                bottom: 5,
                right: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  borderWidth: 1,
                  alignSelf: "flex-end",
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: colorScheme === "dark" ? "black" : "#6FCCDD",
                  borderColor: colorScheme === "dark" ? "black" : "#6FCCDD",
                }}
              >
                <FontAwesome
                  name="language"
                  size={11}
                  color="#625641"
                  style={{ paddingTop: 1 }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "OutFit",
                    color: "#625641",
                  }}
                >
                  {content.language}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  borderWidth: 1,
                  alignSelf: "flex-end",
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  backgroundColor: colorScheme === "dark" ? "black" : "#6FCCDD",
                  borderColor: colorScheme === "dark" ? "black" : "#6FCCDD",
                }}
              >
                {content.type === "PDF" ? (
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={16}
                    color="#625641"
                  />
                ) : (
                  <MaterialIcons name="audiotrack" size={16} color="#625641" />
                )}
              </View>
            </View>
          </View>
        )}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
        ListEmptyComponent={
          <Text
            style={[
              styles.headerText,
              { color: colorScheme === "dark" ? "white" : "#102714" },
            ]}
          >
            No content available.
          </Text>
        }
      />

      <Modal visible={isPlayerVisible} animationType="slide">
        <Pressable
          onPress={() => setPlayerVisible(false)}
          style={styles.closeButton}
        >
          <AntDesign name="closecircle" size={24} color="red" />
        </Pressable>
        {Platform.OS === "web" ? (
          <iframe
            src={pdfUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <WebView source={{ uri: pdfUrl }} style={{ flex: 1 }} />
        )}
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    gap: 20,
  },
  servicesCard: {
    height: 300,
    // height: "100%",
    width: 300,
    backgroundColor: "#F9F9F9",
    // marginHorizontal: 20,
    // padding: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    marginBottom: 20,
    gap: 10,
    // borderWidth: 1,
  },
  serviceName: {
    fontSize: 20,
    fontFamily: "OutFit",
    color: "#102714",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
