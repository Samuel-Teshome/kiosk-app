import atiLogoImg from "@/assets/images/ati-logo.png";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Video } from "expo-av";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { Video as ExpoVideo } from "expo-video";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReactPlayer from "react-player";
import CustomDropdown2 from "../../components/CustomDropDown2";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  // const BASE_URL =
  //   process.env.NODE_ENV !== "production"
  //     ? `http://localhost:3000`
  //     : "http://kiosk.ati.gov.et:3000";
  const BASE_URL = Constants.expoConfig.extra.BASE_URL;

  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const [form, setForm] = useState({
    language: "",
    category: "",
    subjectArea: "",
  });

  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [openCa, setOpenCa] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openSa, setOpenSa] = useState(false);
  const [subjectAreas, setSubjectAreas] = useState([]);

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Don't know how to open URI: ${url}`);
    }
  };

  const handleDropdownChange = (fieldName) => (callback) => {
    const selectedValue = callback(form[fieldName]);
    setForm({ ...form, [fieldName]: selectedValue });
  };

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  // `http://localhost:3000/api/contents?page=${nextPage}&limit=${limit}`
  const fetchConents = async (nextPage = 1) => {
    if (nextPage > totalPages) return;
    const limit = 10;
    fetch(`${BASE_URL}/api/contents?page=${nextPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setPage(nextPage);
        setTotalPages(json.totalPages);
        for (const item of json.data) {
          var videoUrl = `${BASE_URL}/` + item.videoPath;
          var imageUrl = `${BASE_URL}/` + item.thumbNailPath;
          const processed = {
            ...item,
            videoUrl: videoUrl,
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
  // "http://localhost:3000/api/languages"
  // "http://localhost:3000/api/categories"
  // "http://localhost:3000/api/subjectAreas"
  // "http://localhost:3000/api/contents/filter?languageId=" +
  //       form.language +
  //       "&categoryId=" +
  //       form.category +
  //       "&subjectAreaId=" +
  //       form.subjectArea
  useEffect(() => {
    fetchConents();

    fetch(`${BASE_URL}/api/languages`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        // setLanguages([]);
        setLanguages(json);
        // for (const item of json) {
        //   const processed = {
        //     label: item.name,
        //     value: item.id,
        //   };

        //   setLanguages((prev) => [...prev, processed]);
        // }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });

    fetch(`${BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        // setCategories([]);
        setCategories(json);
        // for (const item of json) {
        //   const processed = {
        //     label: item.name,
        //     value: item.id,
        //   };

        //   setCategories((prev) => [...prev, processed]);
        // }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });

    fetch(`${BASE_URL}/api/subjectAreas`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        // setSubjectAreas([]);
        setSubjectAreas(json);
        // for (const item of json) {
        //   const processed = {
        //     label: item.name,
        //     value: item.id,
        //   };

        //   setSubjectAreas((prev) => [...prev, processed]);
        // }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  }, []);

  const filterData = async () => {
    var url = `${BASE_URL}/api/contents/filter?languageId=${form.language}&categoryId=${form.category}&subjectAreaId=${form.subjectArea}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        if (json.length > 0) {
          setContents([]);
        } else {
          if (Platform.OS === "web") {
            toast.error("No Content with Filter Criteria");
          } else {
            Alert.alert("Error", "No Content with Filter Criteria");
          }
        }
        for (const item of json) {
          var videoUrl = `${BASE_URL}/` + item.videoPath;
          var imageUrl = `${BASE_URL}/` + item.thumbNailPath;
          const processed = {
            ...item,
            videoUrl: videoUrl,
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

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      <Toaster
        position="top-right"
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
          styles.header,
          { backgroundColor: colorScheme === "dark" ? "#102714" : "white" },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 150,
          }}
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
          style={[
            styles.servicesCard,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              width: "70%",
              height: 80,
              marginBottom: 5,
            },
          ]}
        >
          <View>
            <CustomDropdown2
              title="Language"
              items={languages}
              value={form.language}
              setValue={handleDropdownChange("language")}
              placeholder="Select Language"
              zIndex={3000}
              zIndexInverse={1000}
              listMode="MODAL"
              labelKey={"name"}
              modalAnimation="fade"
              maxHeight={150}
            />
          </View>
          <View>
            <CustomDropdown2
              title="Category"
              items={categories}
              value={form.category}
              setValue={handleDropdownChange("category")}
              placeholder="Select Category"
              zIndex={3000}
              zIndexInverse={1000}
              listMode="MODAL"
              labelKey={"name"}
              modalAnimation="fade"
              maxHeight={150}
            />
          </View>
          <View>
            <CustomDropdown2
              title="Subject Area"
              items={subjectAreas}
              value={form.subjectArea}
              setValue={handleDropdownChange("subjectArea")}
              placeholder="Select Subject Area"
              zIndex={3000}
              zIndexInverse={1000}
              listMode="MODAL"
              labelKey={"name"}
              modalAnimation="fade"
              maxHeight={150}
            />
          </View>
          <TouchableOpacity onPress={() => filterData()}>
            <View
              style={[
                styles.btn,
                { opacity: colorScheme === "dark" ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.btnText}>Filter</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={contents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesCardContainer}
        renderItem={({ item: content }) => (
          <View style={styles.servicesCard}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {content.videoTitle}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setPlayerVisible(true);
                setVideoTitle(content.videoTitle);
                setVideoUrl(content.videoUrl);
              }}
            >
              <Image
                alt="App Logo"
                contentFit="contain"
                style={[styles.headerImg, { height: 200, width: 250 }]}
                source={{ uri: content.imageUrl }}
              />
            </TouchableOpacity>
            {/* <Pressable onPress={() => openLink(content.youtubeId)}>
              <ThemedText
                type="link"
                style={{ fontFamily: "OutFit", alignItems: "start" }}
              >
                Youtube Link
              </ThemedText>
            </Pressable> */}
            {!isPlayerVisible ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    flexDirection: "row",
                    gap: 5,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      borderWidth: 1,
                      justifyContent: "center",
                      alignContent: "flex-start",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor:
                        colorScheme === "dark" ? "black" : "#334fff",
                      borderColor: colorScheme === "dark" ? "black" : "#334fff",
                    }}
                  >
                    <FontAwesome
                      name="language"
                      size={11}
                      color="white"
                      style={{ paddingTop: 1 }}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "OutFit",
                        color: "white",
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
                      justifyContent: "center",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor:
                        colorScheme === "dark" ? "black" : "#334fff",
                      borderColor: colorScheme === "dark" ? "black" : "#334fff",
                    }}
                  >
                    {content.categoryId == 1 ? (
                      <MaterialIcons
                        name="agriculture"
                        size={11}
                        color="white"
                        style={{ paddingTop: 1 }}
                      />
                    ) : content.categoryId == 2 ? (
                      <MaterialIcons
                        name="category"
                        size={12}
                        color="white"
                        style={{ paddingTop: 1 }}
                      />
                    ) : (
                      <FontAwesome6
                        name="cow"
                        size={12}
                        color="white"
                        style={{ paddingTop: 1 }}
                      />
                    )}

                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "OutFit",
                        color: "white",
                      }}
                    >
                      {content.category}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      borderWidth: 1,
                      justifyContent: "center",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor:
                        colorScheme === "dark" ? "black" : "#334fff",
                      borderColor: colorScheme === "dark" ? "black" : "#334fff",
                    }}
                  >
                    <Feather
                      name="target"
                      size={11}
                      color="white"
                      style={{ paddingTop: 2 }}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "OutFit",
                        color: "white",
                      }}
                    >
                      {content.subjectArea}
                    </Text>
                  </View>
                </View>
                <View>
                  <Pressable onPress={() => openLink(content.youtubeId)}>
                    <FontAwesome
                      name="youtube-play"
                      size={36}
                      color={colorScheme === "dark" ? "black" : "red"}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <Modal visible={isPlayerVisible} animationType="slide">
                <Pressable
                  onPress={() => setPlayerVisible(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="closecircle" size={24} color="red" />
                </Pressable>

                {Platform.OS === "web" ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 10,
                        textAlign: "center",
                        fontFamily: "OutFitBold",
                      }}
                    >
                      {videoTitle}
                    </Text>
                    <ReactPlayer
                      url={videoUrl}
                      playing={false}
                      muted={false}
                      controls
                      width="100%"
                      height="95%"
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                            // disablePictureInPicture: true,
                          },
                        },
                      }}
                    />
                  </View>
                ) : (
                  <ExpoVideo
                    source={{ uri: content.videoUrl }}
                    useNativeControls
                    shouldPlay
                    resizeMode="contain"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </Modal>
            )}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
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
    height: 300,
    width: 300,
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

  dropdownWrapper: {
    zIndex: 10,
    marginVertical: 10,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  text: {
    fontSize: 16,
    fontFamily: "OutFit",
    color: "#333",
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: "OutFit",
  },
  selectedItem: {
    fontWeight: "bold",
    color: "#007AFF",
    fontSize: 16,
  },
  /** Button */
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(19, 143, 73, 0.74)",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "OutFitBold",
    color: "#ffffff",
  },
});
