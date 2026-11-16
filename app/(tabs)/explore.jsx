import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
// import { Video } from "expo-av";
// import Constants from "expo-constants";
import { Image } from "expo-image";
import { Video as ExpoVideo } from "expo-video";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import ReactPlayer from "react-player";
import CustomDropdown2 from "../../components/CustomDropDown2";
import HeaderBar from "../../components/HeaderBar";
import TooltipText from "../../components/TooltipText";

export default function TabTwoScreen() {
  const { i18n, t } = useTranslation();
  const languageValue = i18n.resolvedLanguage || i18n.language;
  const { width, height } = useWindowDimensions();
  const isMobile = width < 480;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const controllerRef = useRef(null);

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  // console.log("API URL: ", BASE_URL);

  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const [form, setForm] = useState({
    language:
      languageValue == "om"
        ? 1
        : languageValue == "am"
          ? 2
          : languageValue == "en"
            ? 3
            : languageValue == "ti"
              ? 5
              : 2,
    category: "",
    subjectArea: "",
  });

  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [openCa, setOpenCa] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openSa, setOpenSa] = useState(false);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [apiUrl, setApiUrl] = useState("");

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
  const [loadingMore, setLoadingMore] = useState(false);
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

  const fetchMore = async () => {
    if (!loadingMore && page < totalPages) {
      // fetchConents(page + 1);
      // filterData("FETCHMORE", page + 1);
      controllerRef.current?.abort();

      let localApiUrl = apiUrl;

      let nextPage = page + 1;

      controllerRef.current = new AbortController();

      await fetchContent({
        localApiUrl,
        signal: controllerRef.current.signal,
        append: true,
        nextPage,
      });
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
    // let languageCode = 0;

    // switch (languageValue) {
    //   case "en":
    //     languageCode = 3;
    //     break;
    //   case "am":
    //     languageCode = 2;
    //     break;
    //   case "om":
    //     languageCode = 1;
    //     break;
    //   case "ti":
    //     languageCode = 5;
    //     break;
    // }

    // setForm({ ...form, ["language"]: languageCode });

    // if (!searchText.trim()) {
    //   setLoading(false);
    //   return;
    // }

    // const timer = setTimeout(async () => {
    //   console.log("@@@@@@@@@@@@@@");
    //   console.log("Search Text: ", searchText);
    //   console.log("Timer: ", timer);
    // }, 400);

    // fetchConents();
    // filterData("Clicked");

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

  useEffect(() => {
    let languageCode = 0;

    switch (languageValue) {
      case "en":
        languageCode = 3;
        break;
      case "am":
        languageCode = 2;
        break;
      case "om":
        languageCode = 1;
        break;
      case "ti":
        languageCode = 5;
        break;
    }

    setForm({ ...form, ["language"]: languageCode });

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchData = async () => {
      let localApiUrl = "";

      if (searchText.trim() !== "") {
        const params = new URLSearchParams({
          keyword: searchText.trim(),
        });

        localApiUrl = `${BASE_URL}/api/contents/search?${params.toString()}`;
        setContents([]);
      } else {
        const params = new URLSearchParams();

        params.append("languageId", form.language);
        params.append("categoryId", form.category);
        params.append("subjectAreaId", form.subjectArea);

        localApiUrl = `${BASE_URL}/api/contents/filter?${params.toString()}`;
      }

      await fetchContent({
        localApiUrl,
        signal: controller.signal,
        append: false,
      });
    };

    const delay = searchText.trim() !== "" ? 400 : 0;

    const timer = setTimeout(fetchData, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [languageValue, searchText]);

  const filterData2 = async () => {
    var url = `${BASE_URL}/api/contents/filter?languageId=${form.language}&categoryId=${form.category}&subjectAreaId=${form.subjectArea}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        if (json.length > 0) {
          setContents([]);
        } else {
          if (Platform.OS === "web") {
            toast.error(t("advisory.filter.nofiltercontent"));
          } else {
            Alert.alert("Error", t("advisory.filter.nofiltercontent"));
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

  const filterData3 = async (event, nextPage = 1) => {
    if (event != "FETCHMORE") {
      setContents([]);
    }

    if (nextPage > totalPages) return;
    const limit = 10;
    var url = `${BASE_URL}/api/contents/filter?languageId=${form.language}&categoryId=${form.category}&subjectAreaId=${form.subjectArea}&page=${nextPage}&limit=${limit}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setPage(nextPage);
        setTotalPages(json.totalPages);

        if (json.statusMessage == "No Contents" || json.data.length == 0) {
          if (Platform.OS === "web") {
            toast.error(t("advisory.filter.nofiltercontent"));
          } else {
            Alert.alert("Error", t("advisory.filter.nofiltercontent"));
          }
        }
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

  const fetchContent = async ({
    localApiUrl,
    signal,
    append = false,
    nextPage = 1,
  }) => {
    try {
      if (nextPage > totalPages) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setPage(nextPage);
      // setTotalPages(json.totalPages);

      const limit = 10;

      const params = new URLSearchParams({
        page: String(nextPage),
        limit: limit,
      });

      const updatedApiUrl = `${localApiUrl}&${params.toString()}`;

      setApiUrl(localApiUrl);

      const response = await fetch(updatedApiUrl, { signal });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      console.log("Result: ", result);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      if (append) {
        // setContents([]);
        //   console.log("############################");
        //   console.log("Append Content: ", append);
        //   console.log("############################");
      } else {
        // setData(result);
        setContents([]);
        //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //   console.log("Append Content: ", append);
        //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      }

      setTotalPages(result.totalPages);

      if (result.statusMessage == "No Contents" || result.data.length == 0) {
        if (Platform.OS === "web") {
          toast.error(t("advisory.filter.nofiltercontent"));
        } else {
          Alert.alert("Error", t("advisory.filter.nofiltercontent"));
        }
      }

      for (const item of result.data) {
        var videoUrl = `${BASE_URL}/` + item.videoPath;
        var imageUrl = `${BASE_URL}/` + item.thumbNailPath;
        const processed = {
          ...item,
          videoUrl: videoUrl,
          imageUrl: imageUrl,
        };

        setContents((prev) => [...prev, processed]);
      }

      return result;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching data:", error);
      }

      return null;
    } finally {
      if (!signal?.aborted) {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    }
  };

  const handleButtonPress = async () => {
    controllerRef.current?.abort();

    setSearchText("");

    let localApiUrl = "";

    controllerRef.current = new AbortController();

    const params = new URLSearchParams();

    params.append("languageId", form.language);
    params.append("categoryId", form.category);
    params.append("subjectAreaId", form.subjectArea);

    localApiUrl = `${BASE_URL}/api/contents/filter?${params.toString()}`;

    await fetchContent({
      localApiUrl,
      signal: controllerRef.current.signal,
      append: false,
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
      <HeaderBar />
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
        }}
      >
        <View
          style={[
            styles.servicesCard,
            {
              flexDirection: isMobile ? "column" : "row",
              alignSelf: "center",
              justifyContent: "center",
              gap: 20,
              width: isMobile ? "90%" : "60%",
              height: isMobile ? 150 : 80,
              marginBottom: 5,
              marginTop: isMobile ? 0 : 10,
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
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View>
              <CustomDropdown2
                title={t("advisory.modal.language")}
                items={languages}
                value={form.language}
                setValue={handleDropdownChange("language")}
                placeholder={t("header.language.select")}
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
                title={t("advisory.modal.category")}
                items={categories}
                value={form.category}
                setValue={handleDropdownChange("category")}
                placeholder={t("advisory.filter.category")}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="MODAL"
                labelKey={"name"}
                modalAnimation="fade"
                maxHeight={150}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View>
              <CustomDropdown2
                title={t("advisory.modal.subjectArea")}
                items={subjectAreas}
                value={form.subjectArea}
                setValue={handleDropdownChange("subjectArea")}
                placeholder={t("advisory.filter.subjectArea")}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="MODAL"
                labelKey={"name"}
                modalAnimation="fade"
                maxHeight={150}
              />
            </View>
            <TouchableOpacity onPress={() => handleButtonPress()}>
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
                <Text style={styles.btnText}>{t("buttons.search")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.servicesCard,
            {
              flexDirection: isMobile ? "column" : "row",
              alignSelf: "center",
              justifyContent: "center",
              gap: 20,
              width: isMobile ? "90%" : "20%",
              height: isMobile ? 80 : 80,
              marginBottom: 5,
              marginTop: isMobile ? 0 : 10,
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
          <TextInput
            placeholder={t("advisory.filter.search")}
            placeholderTextColor={isDark ? "#888888" : "#999999"}
            value={searchText}
            onChangeText={setSearchText}
            style={{
              borderWidth: 1,
              // borderColor: "#ccc",
              borderColor: isDark ? "#777777" : "#ccc",
              backgroundColor: isDark ? "transparent" : "#fff",
              fontSize: 15,
              fontFamily: "OutFit",
              color: isDark ? "#fff" : "#585858",
              borderRadius: 8,
              padding: 10,
            }}
          />
        </View>
      </View>

      {/* Old Filter Code */}
      {/* <View
        style={[
          styles.servicesCard,
          {
            flexDirection: isMobile ? "column" : "row",
            alignSelf: "center",
            justifyContent: "center",
            gap: 20,
            width: isMobile ? "90%" : "70%",
            height: isMobile ? 150 : 80,
            marginBottom: 5,
            marginTop: 10,
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
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View>
            <CustomDropdown2
              title={t("advisory.modal.language")}
              items={languages}
              value={form.language}
              setValue={handleDropdownChange("language")}
              placeholder={t("header.language.select")}
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
              title={t("advisory.modal.category")}
              items={categories}
              value={form.category}
              setValue={handleDropdownChange("category")}
              placeholder={t("advisory.filter.category")}
              zIndex={3000}
              zIndexInverse={1000}
              listMode="MODAL"
              labelKey={"name"}
              modalAnimation="fade"
              maxHeight={150}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View>
            <CustomDropdown2
              title={t("advisory.modal.subjectArea")}
              items={subjectAreas}
              value={form.subjectArea}
              setValue={handleDropdownChange("subjectArea")}
              placeholder={t("advisory.filter.subjectArea")}
              zIndex={3000}
              zIndexInverse={1000}
              listMode="MODAL"
              labelKey={"name"}
              modalAnimation="fade"
              maxHeight={150}
            />
          </View>
          <TouchableOpacity onPress={() => filterData("Clicked")}>
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
              <Text style={styles.btnText}>{t("buttons.search")}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            style={{
              borderWidth: 1,
              // borderColor: "#ccc",
              borderColor: isDark ? "#777777" : "#ccc",
              backgroundColor: isDark ? "transparent" : "#fff",
              fontSize: 15,
              fontFamily: "OutFit",
              color: isDark ? "#fff" : "#585858",
              borderRadius: 8,
              padding: 10,
            }}
          />
        </View>
      </View> */}
      {/* <View
        style={[
          styles.servicesCard,
          {
            flexDirection: "row",
            // flexWrap: "wrap",
            justifyContent: "center",
            // alignItems: "center",
            // alignContent: "center",
            alignSelf: "center",
            // borderWidth: 1,
            gap: 20,
            width: "70%",
            height: 80,
            marginBottom: 5,
            marginTop: 10,
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
            style={[styles.btn, { opacity: isDark ? 0.8 : 1 }]}
          >
            <Text style={styles.btnText}>Filter</Text>
          </View>
        </TouchableOpacity>
      </View> */}
      {/* </View> */}
      <FlatList
        data={contents}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.servicesCardContainer}
        renderItem={({ item: content }) => (
          <View
            style={[
              styles.servicesCard,
              {
                ShadowColor: isDark ? "white" : "black",
                boxShadow: isDark
                  ? "0 4px 8px rgba(255, 255, 255, 0.5)"
                  : "0 4px 8px rgba(0, 0, 0, 0.5)",
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                backgroundColor: isDark ? "#323232" : "#F9F9F9",
                gap: 5,
              },
            ]}
          >
            <TooltipText
              localVideoTitle={content.localVideoTitle}
              localLocation={content.localLocation}
              videoTitle={content.videoTitle}
              location={content.location}
            />

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
                style={[
                  styles.headerImg,
                  {
                    height: 180,
                    width: 230,
                    borderWidth: isDark ? 0 : 0,
                    borderColor: isDark ? "#5e5e5a" : "#334fff",
                    borderRadius: 5,
                  },
                ]}
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
                    width: "85%",
                    flexDirection: "row",
                    gap: 5,
                    flexWrap: "wrap",
                    // justifyContent: "space-between",
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
                      alignItems: "center",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor: isDark ? "#323232" : "#625641",
                      borderWidth: isDark ? 1 : 0,
                      borderColor: isDark ? "#5e5e5a" : "#625641",
                    }}
                  >
                    <FontAwesome6
                      name="location-dot"
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
                      {content.localLocation}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      borderWidth: 1,
                      justifyContent: "center",
                      alignContent: "flex-start",
                      alignItems: "center",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor: isDark ? "#323232" : "#334fff",
                      borderWidth: isDark ? 1 : 0,
                      borderColor: isDark ? "#5e5e5a" : "#334fff",
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
                      alignItems: "center",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor: isDark ? "#323232" : "#334fff",
                      borderWidth: isDark ? 1 : 0,
                      borderColor: isDark ? "#5e5e5a" : "#334fff",
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
                      alignItems: "center",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      height: "50%",
                      backgroundColor: isDark ? "#323232" : "#334fff",
                      borderWidth: isDark ? 1 : 0,
                      borderColor: isDark ? "#5e5e5a" : "#334fff",
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
                      {content.subjectArea?.length > 20
                        ? content.subjectArea.substring(0, 20) + "..."
                        : content.subjectArea}
                    </Text>
                  </View>
                </View>
                <View>
                  <Pressable onPress={() => openLink(content.youtubeId)}>
                    <FontAwesome
                      name="youtube-play"
                      size={30}
                      color={isDark ? "#fff" : "red"}
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
        // ListFooterComponent={
        //   loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        // }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
        ListEmptyComponent={
          <Text
            style={[styles.headerText, { color: isDark ? "white" : "#102714" }]}
          >
            {t("home.nocontent")}
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
    // backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    marginBottom: 30,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: "OutFit",
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
