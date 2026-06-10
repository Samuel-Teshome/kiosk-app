import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import Papa from "papaparse";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import CustomDropdown2 from "../components/CustomDropDown2";
import HeaderBar2 from "../components/HeaderBar2";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width, height } = useWindowDimensions();
  const isMobile = width < 480;
  const router = useRouter();
  const [form, setForm] = useState({
    type: "",
    fileName: "",
  });

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  // console.log("API URL: ", BASE_URL);

  const [kebeleOpen, setKebeleOpen] = useState(false);
  const [kebeleItems, setKebeleItems] = useState([
    { label: "Categories", value: "3" },
    { label: "Digital Green Contents", value: "2" },
    { label: "Languages", value: "4" },
    { label: "Services", value: "1" },
    { label: "Subject Areas", value: "5" },
    { label: "GSMA Content", value: "6" },
    { label: "8028 Languages", value: "7" },
    { label: "8028 Top Menus", value: "8" },
    { label: "8028 Main Menus", value: "9" },
    { label: "8028 Sub Menus", value: "10" },
    { label: "8028 Crop Menus", value: "11" },
    { label: "8028 Altitude Menus", value: "12" },
    { label: "8028 Soil Type Menus", value: "13" },
    { label: "8028 Audio Contents", value: "14" },
  ]);

  const [dataTypeItems, setDataTypeItems] = useState([
    { id: "3", name: "Categories" },
    { id: "2", name: "Contents" },
    { id: "4", name: "Languages" },
    { id: "1", name: "Services" },
    { id: "5", name: "Subject Areas" },
    { id: "6", name: "GSMA Contents" },
    { id: "7", name: "8028 Languages" },
    { id: "8", name: "8028 Top Menus" },
    { id: "9", name: "8028 Main Menus" },
    { id: "10", name: "8028 Sub Menus" },
    { id: "11", name: "8028 Crop Menus" },
    { id: "12", name: "8028 Altitude Menus" },
    { id: "13", name: "8028 Soil Type Menus" },
    { id: "14", name: "8028 Audio Contents" },
    { id: "15", name: "8028 Livestock Menus" },
  ]);
  const handleDropdownChange = (fieldName) => (callback) => {
    const selectedValue = callback(form[fieldName]);
    setForm({ ...form, [fieldName]: selectedValue });
  };
  const [jsonData, setJsonData] = useState(null);
  const fileInputRef = useRef(null);

  const openFilePicker = async () => {
    if (Platform.OS === "web") {
      fileInputRef.current.click();
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "text/csv", // all file types, or e.g. 'application/pdf'
          copyToCacheDirectory: true,
        });
        if (result && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          setForm((prevForm) => ({
            ...prevForm,
            fileName: file.name,
          }));
          const fileUri = res.uri;

          const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.UTF8,
          });

          parseCSV(fileContent);
        } else {
          if (Platform.OS === "web") {
            toast.error("File picking cancelled");
          } else {
            Alert.alert("Error", "File picking cancelled");
          }
        }
      } catch (err) {
        var msg = "File picker error:" + err;
        if (Platform.OS === "web") {
          toast.error(msg);
        } else {
          Alert.alert("Error", msg);
        }
      }
    }
  };

  const handleWebFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prevForm) => ({
        ...prevForm,
        fileName: file.name,
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText) => {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    setJsonData(parsed.data);
    if (Platform.OS === "web") {
      toast.success(`Parsed ${parsed.data.length} rows`);
    } else {
      Alert.alert("File ready", `Parsed ${parsed.data.length} rows`);
    }
  };

  const sendData = async () => {
    var url = "";

    if (form.type == "") {
      if (Platform.OS === "web") {
        toast.error("Please select type of data");
      } else {
        Alert.alert("No data", "Please select type of data");
      }
      return;
    }
    if (!jsonData) {
      if (Platform.OS === "web") {
        toast.error("Please pick and parse a file first");
      } else {
        Alert.alert("No data", "Please pick and parse a file first");
      }
      return;
    }

    if (form.type == 1) {
      // url = "http://localhost:3000/api/services";
      url = `${BASE_URL}/api/services`;
    } else if (form.type == 2) {
      // url = "http://localhost:3000/api/contents";
      url = `${BASE_URL}/api/contents`;
    } else if (form.type == 3) {
      // url = "http://localhost:3000/api/categories";
      url = `${BASE_URL}/api/categories`;
    } else if (form.type == 4) {
      // url = "http://localhost:3000/api/languages";
      url = `${BASE_URL}/api/languages`;
    } else if (form.type == 5) {
      // url = "http://localhost:3000/api/subjectAreas";
      url = `${BASE_URL}/api/subjectAreas`;
    } else if (form.type == 6) {
      // url = "http://localhost:3000/api/subjectAreas";
      url = `${BASE_URL}/api/gsma`;
    } else if (form.type == 7) {
      url = `${BASE_URL}/api/8028_languages`;
    } else if (form.type == 8) {
      url = `${BASE_URL}/api/8028_top_menus`;
    } else if (form.type == 9) {
      url = `${BASE_URL}/api/8028_main_menus`;
    } else if (form.type == 10) {
      url = `${BASE_URL}/api/8028_sub_menus`;
    } else if (form.type == 11) {
      url = `${BASE_URL}/api/8028_crop_menus`;
    } else if (form.type == 12) {
      url = `${BASE_URL}/api/8028_altitude_menus`;
    } else if (form.type == 13) {
      url = `${BASE_URL}/api/8028_soil_type_menus`;
    } else if (form.type == 14) {
      url = `${BASE_URL}/api/8028_audio_contents`;
    } else if (form.type == 15) {
      url = `${BASE_URL}/api/8028_livestock_menus`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: jsonData }),
      });

      const json = await response.json();

      if (json.error != undefined) {
        if (Platform.OS === "web") {
          toast.error(json.error);
        } else {
          Alert.alert("Error", json.error);
        }
      } else if (json.message != undefined) {
        var msg =
          json.message +
          " " +
          json.inserted +
          " inserted and " +
          json.duplicates +
          " duplicate skipped!";
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
      <HeaderBar2 />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <View
          style={[
            styles.servicesCard,
            {
              alignItems: "center",
              gap: 20,
              width: isMobile ? "100%" : "80%",
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
            {/* <ThemedText type="title">Data Management</ThemedText> */}
            <Text
              style={{
                color: isDark ? "white" : "#615542",
                fontSize: 32,
                fontWeight: "bold",
                lineHeight: 32,
              }}
            >
              Data Management
            </Text>
          </View>
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
                width: isMobile ? "80%" : "50%",
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
                width: isMobile ? "80%" : "50%",
              }}
            >
              <View>
                <CustomDropdown2
                  title="Data Type"
                  items={dataTypeItems}
                  value={form.type}
                  setValue={handleDropdownChange("type")}
                  placeholder="Select Data Type"
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
                flex: 1,
                flexDirection: "row",
                width: isMobile ? "80%" : "50%",
              }}
            >
              <Text
                style={[
                  styles.inputLabel,
                  { color: isDark ? "white" : "#615542" },
                ]}
              >
                Data File
              </Text>
              <Text style={{ color: isDark ? "white" : "red" }}> *</Text>
            </View>

            <View
              style={{
                position: "relative",
                width: "100%",
                marginBottom: 20,
                width: isMobile ? "80%" : "50%",
              }}
            >
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                placeholder="Upload a file ..."
                placeholderTextColor={isDark ? "#fff" : "#585858"}
                style={[
                  styles.inputControl,
                  {
                    backgroundColor: isDark ? "transparent" : "#fff",
                    color: isDark ? "#fff" : "#585858",
                  },
                ]}
                value={form.fileName}
              />
              <Pressable style={styles.iconButton} onPress={openFilePicker}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color={isDark ? "#fff" : "#555"}
                />
              </Pressable>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleWebFileChange}
              />
            </View>
          </View>
          <View
            style={[
              styles.input,
              {
                // justifyContent: "center",
                // alignItems: "center",
                // borderWidth: 1,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",
                width: isMobile ? "80%" : "50%",
                // paddingHorizontal: 30,
                gap: 50,
                // borderWidth: 1,
              }}
            >
              <TouchableOpacity onPress={() => sendData()}>
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
        </View>
        <View
          style={{
            position: "absolute",
            right: isMobile ? 5 : 220,
            top: isMobile ? 10 : 16,
          }}
        >
          <TouchableOpacity onPress={() => router.push("/register")}>
            <FontAwesome
              name="user-plus"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 10,
    // alignItems: "center",
    gap: 20,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  servicesCard: {
    // height: 300,
    width: "80%",
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
    alignSelf: "center",
    gap: 20,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
    flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
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
  inputControl: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "OutFit",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: "40%",
    transform: [{ translateY: -12 }],
    padding: 5,
  },
  dropdownWrapper: {
    zIndex: 10,
    marginBottom: 20,
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
    fontFamily: "outFit",
    color: "#333",
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: "outFit",
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
