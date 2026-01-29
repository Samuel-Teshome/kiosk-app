import { ThemedText } from "@/components/ThemedText";
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
  console.log("API URL: ", BASE_URL);

  const [kebeleOpen, setKebeleOpen] = useState(false);
  const [kebeleItems, setKebeleItems] = useState([
    { label: "Categories", value: "3" },
    { label: "Digital Green Contents", value: "2" },
    { label: "Languages", value: "4" },
    { label: "Services", value: "1" },
    { label: "Subject Areas", value: "5" },
    { label: "GSMA Content", value: "6" },
  ]);

  const [dataTypeItems, setDataTypeItems] = useState([
    { id: "3", name: "Categories" },
    { id: "2", name: "Contents" },
    { id: "4", name: "Languages" },
    { id: "1", name: "Services" },
    { id: "5", name: "Subject Areas" },
    { id: "6", name: "GSMA Contents" },
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
            { alignItems: "center", gap: 20, width: isMobile ? "100%" : "80%" },
          ]}
        >
          <View style={{ alignItems: "center" }}>
            <ThemedText type="title">Data Management</ThemedText>
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
                  { color: colorScheme === "dark" ? "white" : "#615542" },
                ]}
              >
                Type
              </Text>
              <Text style={{ color: colorScheme === "dark" ? "white" : "red" }}>
                {" "}
                *
              </Text>
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
                  { color: colorScheme === "dark" ? "white" : "#615542" },
                ]}
              >
                Data File
              </Text>
              <Text style={{ color: colorScheme === "dark" ? "white" : "red" }}>
                {" "}
                *
              </Text>
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
                placeholderTextColor={
                  colorScheme === "dark" ? "black" : "#585858"
                }
                style={styles.inputControl}
                value={form.fileName}
              />
              <Pressable style={styles.iconButton} onPress={openFilePicker}>
                <Ionicons name="cloud-upload-outline" size={24} color="#555" />
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
                    { opacity: colorScheme === "dark" ? 0.8 : 1 },
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
        <View
          style={{
            position: "absolute",
            right: isMobile ? 5 : 220,
            top: isMobile ? 10 : 16,
          }}
        >
          <TouchableOpacity onPress={() => router.push("/register")}>
            <FontAwesome name="user-plus" size={24} color="black" />
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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#585858",
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
