import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDropdown2 from "../components/CustomDropDown2";
import HeaderBar2 from "../components/HeaderBar2";
const Downloader = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const hostname_list = window.location.hostname;
  const hostname_download = "kiosk.ati.gov.et";
  const port = 3000;
  const BASE_URL_LIST = `http://${hostname_list}:${port}`;
  const BASE_URL_DOWN = `http://${hostname_download}:${port}`;

  const [showFileList, setShowFileList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [progress, setProgress] = useState(0);
  const [contents, setContents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [downloadTypeItems, setDownloadTypeItems] = useState([
    { id: "1", name: "Extension Videos" },
    { id: "2", name: "8028 Audio" },
  ]);

  const [form, setForm] = useState({
    type: "",
  });

  const handleDropdownChange = (fieldName) => (callback) => {
    const selectedValue = callback(form[fieldName]);
    setForm({ ...form, [fieldName]: selectedValue });
  };

  const fetchConents = async (nextPage = 1) => {
    if (nextPage > totalPages) return;
    const type = form.type;
    const limit = 15;
    fetch(`${BASE_URL_LIST}/api/files/${type}?page=${nextPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setShowFileList(true);
        setPage(nextPage);
        setTotalPages(json.totalPages);

        for (const item of json.data) {
          const processed = {
            ...item,
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

  const downloadAudio = async (filename) => {
    let filenames = [];
    let dirHandle = null;
    if (filename == "ALL") {
      filenames = contents
        .filter((item) => !item.downloaded)
        .map((item) => item.filename);
      dirHandle = await window.showDirectoryPicker();
    } else {
      filenames = [filename];
    }

    for (const filename of filenames) {
      setDownloadingFile(filename);
      setProgress(0);
      const type = form.type;
      const url = `${BASE_URL_DOWN}/api/download/${type}/${filename}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Download failed: ${response.status} ${response.statusText}`,
          );
        }

        const contentLength = Number(response.headers.get("content-length"));

        const reader = response.body.getReader();

        let receivedLength = 0;
        const chunks = [];

        try {
          let fileHandle;

          if (dirHandle) {
            fileHandle = await dirHandle.getFileHandle(filename, {
              create: true,
            });
          } else {
            fileHandle = await window.showSaveFilePicker({
              suggestedName: filename,
            });
          }

          const writable = await fileHandle.createWritable();

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            await writable.write(value);

            receivedLength += value.length;

            const progress = Math.round((receivedLength / contentLength) * 100);

            if (progress === 100) {
              setContents((prevContents) =>
                prevContents.map((item) =>
                  item.filename === filename
                    ? { ...item, downloaded: true }
                    : item,
                ),
              );
            }

            setProgress(progress);
          }

          await writable.close();
        } catch (err) {
          console.error("Failed to save file:", err);
        }

        setDownloadingFile(null);
        setProgress(0);
      } catch (err) {
        console.error(err);

        setDownloadingFile(null);
        setProgress(0);

        toast.error("Audio file not found.");
      }
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ThemedView style={{ flex: 1 }}>
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
      <HeaderBar2 />

      <View
        style={[
          styles.servicesCard,
          {
            flex: 1,
            width: "50%",
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
        {!showFileList && (
          <View style={{ alignItems: "center" }}>
            <ThemedText type="title">Downloader</ThemedText>
            <View
              style={[
                styles.input,
                {
                  alignItems: "center",
                  width: "100%",
                },
              ]}
            >
              <View
                style={{
                  // flex: 1,
                  flexDirection: "row",
                  width: "50%",
                  // width: "100%",
                }}
              >
                <Text
                  style={[
                    styles.inputLabel,
                    { color: isDark ? "white" : "#615542" },
                  ]}
                >
                  Type
                </Text>
                <Text style={{ color: isDark ? "white" : "red" }}> *</Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <View>
                  <CustomDropdown2
                    title="Download Type"
                    items={downloadTypeItems}
                    value={form.type}
                    setValue={handleDropdownChange("type")}
                    placeholder="Select Download Type"
                    zIndex={3000}
                    zIndexInverse={1000}
                    listMode="MODAL"
                    labelKey={"name"}
                    modalAnimation="fade"
                    maxHeight={150}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",
                width: "50%",
                // paddingHorizontal: 30,
                gap: 50,
                // borderWidth: 1,
              }}
            >
              <TouchableOpacity onPress={() => fetchConents()}>
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
                  router.replace("/");
                }}
              >
                <View
                  style={[
                    styles.btn,
                    {
                      // backgroundColor:
                      //   isDark
                      //     ? "#A1A1A3"
                      //     : "rgba(97, 85, 66, 0.74)",
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
        )}
        {showFileList && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => router.replace("/downloader")}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerText,
                { color: isDark ? "white" : "#102714", textAlign: "center" },
              ]}
            >
              {form.type == 1 ? "Extension Video" : "8028 Audio"}
            </Text>
            {contents && (
              <TouchableOpacity
                disabled={contents?.every((item) => item.downloaded)}
                onPress={() => downloadAudio("ALL")}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                  backgroundColor: contents?.every((item) => item.downloaded)
                    ? "#666"
                    : isDark
                      ? "#323232"
                      : "#F9F9F9",
                  ShadowColor: isDark ? "white" : "black",
                  boxShadow: isDark
                    ? "0 1px 2px rgba(255, 255, 255, 0.5)"
                    : "0 1px 2px rgba(0, 0, 0, 0.5)",
                  padding: 10,
                  alignSelf: "end",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    color: contents?.every((item) => item.downloaded)
                      ? "#fff"
                      : isDark
                        ? "#fff"
                        : "#615542",
                  }}
                >
                  Download All
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                backgroundColor: isDark ? "#323232" : "#F9F9F9",
                ShadowColor: isDark ? "white" : "black",
                boxShadow: isDark
                  ? "0 1px 2px rgba(255, 255, 255, 0.5)"
                  : "0 1px 2px rgba(0, 0, 0, 0.5)",
                padding: 10,
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  color: isDark ? "#fff" : "#615542",
                  width: "5%",
                  fontFamily: "OutFitBold",
                }}
              >
                No.
              </Text>
              <View
                style={{
                  width: "40%",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#fff" : "#615542",
                    fontFamily: "OutFitBold",
                  }}
                >
                  File Name
                </Text>
              </View>
              <View
                style={{
                  width: "40%",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#fff" : "#615542",
                    fontFamily: "OutFitBold",
                  }}
                >
                  Title
                </Text>
              </View>
              <Text
                style={{
                  color: isDark ? "#fff" : "#615542",
                  width: "15%",
                  fontFamily: "OutFitBold",
                }}
              >
                Action
              </Text>
            </View>
            <FlatList
              data={contents}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              contentContainerStyle={styles.servicesCardContainer}
              renderItem={({ item: content, index: index }) => (
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                    backgroundColor: isDark ? "#323232" : "#F9F9F9",
                    ShadowColor: isDark ? "white" : "black",
                    boxShadow: isDark
                      ? "0 1px 2px rgba(255, 255, 255, 0.5)"
                      : "0 1px 2px rgba(0, 0, 0, 0.5)",
                    padding: 10,
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#615542",
                        width: "10%",
                        fontFamily: "OutFit",
                      }}
                    >
                      {index + 1}
                    </Text>
                    <View
                      style={{
                        width: "40%",
                      }}
                    >
                      <Text
                        style={{
                          color: isDark ? "#fff" : "#615542",
                          fontFamily: "OutFit",
                        }}
                      >
                        {content.filename}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "40%",
                      }}
                    >
                      <Text
                        style={{
                          color: isDark ? "#fff" : "#615542",
                          fontFamily: "OutFit",
                        }}
                      >
                        {content.contentPlayedLog}
                      </Text>
                    </View>
                    {content?.downloaded ? (
                      <Ionicons
                        style={{
                          width: "5%",
                          alignContent: "center",
                        }}
                        name={
                          isDark
                            ? "checkmark-done-circle-outline"
                            : "checkmark-done-circle"
                        }
                        size={24}
                        color={isDark ? "white" : "green"}
                      />
                    ) : downloadingFile === content.filename ? (
                      <View
                        style={{
                          justifyContent: "center",
                          borderRadius: 50,
                          height: "50%",
                          borderWidth: 1,
                          borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                          backgroundColor: isDark ? "#323232" : "#38BA5D",
                          padding: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontFamily: "OutFit",
                            textAlign: "center",
                          }}
                        >
                          {progress}%
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => downloadAudio(content.filename)}
                        style={{
                          width: "5%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesome
                          name="download"
                          size={16}
                          color={isDark ? "white" : "#0C6FA8"}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              onEndReached={fetchMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : null
              }
              ListEmptyComponent={
                <Text
                  style={[
                    styles.headerText,
                    {
                      color: isDark ? "white" : "#102714",
                      textAlign: "center",
                    },
                  ]}
                >
                  No content available.
                </Text>
              }
            />
          </View>
        )}
      </View>
    </ThemedView>
  );
};

export default Downloader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  servicesCardContainer: {
    paddingTop: 10,
  },

  servicesCard: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    marginBottom: 30,
    alignSelf: "center",
    gap: 20,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "OutFitBold",
    marginBottom: 8,
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

  headerText: {
    fontSize: 40,
    fontFamily: "OutFitBold",
    marginVertical: 10,
  },
});
