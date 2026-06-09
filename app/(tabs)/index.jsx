import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
// import Constants from "expo-constants";
import ati8028LogoImg from "@/assets/images/8028-logo.png";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import AudioPlayer from "../../components/AudioPlayer";
import { ColorBar3 } from "../../components/ColorBar";
import HeaderBar from "../../components/HeaderBar";

export default function HomeScreen() {
  const opacity = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width, height } = useWindowDimensions();
  const isMobile = width < 480;
  const [atLeastOneUser, setAtLeastOneUser] = useState();
  const [isDialerVisible, setDialerVisible] = useState(false);

  // const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  // console.log("BASE URL:", BASE_URL);
  // const API = window.location.hostname.includes("192.168.10")
  // ? "http://192.168.10.10:3000"
  // : "http://localhost:8000";
  const hostname = window.location.hostname;
  const port = 3000;
  const BASE_URL = `http://${hostname}:${port}`;
  // console.log("API URL: ", BASE_URL);

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

  const [languageCode, setLanguageCode] = useState(0);
  const [language8028Code, setLanguage8028Code] = useState(0);
  const [topMainMenuCode, setTopMainMenuCode] = useState(0);
  const [mainMenuCode, setMainMenuCode] = useState(0);
  const [subMenuCode, setSubMenuCode] = useState(0);
  const [livestockMenuCode, setLivestockMenuCode] = useState(0);
  const [livestockSubMenuCode, setLivestockSubMenuCode] = useState(0);
  const [altitudeCode, setAltitudeCode] = useState(0);
  const [soilTypeCode, setSoilTypeCode] = useState(0);
  const [cropCode, setCropCode] = useState(0);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [_8028Languages, set_8028Languages] = useState([]);
  const [_8028TopMenus, set_8028TopMenus] = useState([]);
  const [_8028MainMenus, set_8028MainMenus] = useState([]);
  const [_8028SubMenus, set_8028SubMenus] = useState([]);
  const [_8028CropMenus, set_8028CropMenus] = useState([]);
  const [_8028AltitudeMenus, set_8028AltitudeMenus] = useState([]);
  const [_8028SoilTypeMenus, set_8028SoilTypeMenus] = useState([]);
  const [_8028LivestockMenus, set_8028LivestockMenus] = useState([]);
  const [_8028LivestockSubMenus, set_8028LivestockSubMenus] = useState([]);
  const [_8028AudioContent, set_8028AudioContent] = useState();
  const [_8028ContentPlayedLog, set_8028ContentPlayedLog] = useState("");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showCropMenu, setShowCropMenu] = useState(false);
  const [show8CropMenu, setShow8CropMenu] = useState(false);
  const [showHHICropMenu, setShowHHICropMenu] = useState(false);
  const [showHHICropMenuM, setShowHHICropMenuM] = useState(false);
  const [showHHICropMenuST, setShowHHICropMenuST] = useState(false);
  const [showAltitudeMenu, setShowAltitudeMenu] = useState(false);
  const [showSoilTypeMenu, setShowSoilTypeMenu] = useState(false);
  const [showLivestockMenu, setShowLivestockMenu] = useState(false);
  const [showLivestockSubMenu, setShowLivestockSubMenu] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState();
  const [selectedLanguageName, setSelectedLanguageName] = useState();
  const [languageLabel, setLanguageLabel] = useState();
  const [defaultTopLabel, setDefaultTopLabel] = useState();
  const [topMenuLabel, setTopMenuLabel] = useState();
  const [showTopMenuLabel, setShowTopMenuLabel] = useState(false);
  const [mainMenuLabel, setMainMenuLabel] = useState();
  const [showMainMenuLabel, setShowMainMenuLabel] = useState(false);
  const [subMenuLabel, setSubMenuLabel] = useState();
  const [showSubMenuLabel, setShowSubMenuLabel] = useState(false);
  const [cropMenuLabel, setCropMenuLabel] = useState();
  const [showCropMenuLabel, setShowCropMenuLabel] = useState(false);
  const [showLivestockMenuLabel, setShowLivestockMenuLabel] = useState(false);
  const [livestockMenuLabel, setLivestockMenuLabel] = useState();
  const [showLivestockSubMenuLabel, setShowLivestockSubMenuLabel] =
    useState(false);
  const [livestockSubMenuLabel, setLivestockSubMenuLabel] = useState();
  const [showSoilTypeCropMenuLabel, setShowSoilTypeCropMenuLabel] =
    useState(false);
  const [altitudeMenuLabel, setAltitudeMenuLabel] = useState();
  const [showAltitudeMenuLabel, setShowAltitudeMenuLabel] = useState(false);
  const [soilTypeMenuLabel, setSoilTypeMenuLabel] = useState();
  const [showSoilTypeMenuLabel, setShowSoilTypeMenuLabel] = useState(false);
  const [backingCropList, setBackingCropList] = useState("");
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const closeModal = () => {
    setDialerVisible(false);
  };

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

  const get8028Langages = async () => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_languages`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          lanLbl = "";
          for (const item of json) {
            const processed = {
              ...item,
            };
            if (lanLbl === "") {
              lanLbl = item.languageTranslation;
            } else {
              lanLbl = lanLbl + " / " + item.languageTranslation;
            }

            set_8028Languages((prev) => [...prev, processed]);
          }
          setLanguageLabel(lanLbl);
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const selectLanguage = (language) => {
    setSelectedLanguageCode(language.code);
    setLanguageCode(language.code);
    setLanguage8028Code(language.code8028);
    setSelectedLanguageName(language.displayName);
    setShowLanguageOptions(false);
    setShowTopMenu(true);
    setShowMainMenu(false);
    setShowMainMenuLabel(false);
    setShowSubMenu(false);
    setShowSubMenuLabel(false);
    setShowCropMenu(false);
    setShowCropMenuLabel(false);
    setShow8CropMenu(false);
    setShowAltitudeMenu(false);
    setShowSoilTypeMenu(false);
    setShowHHICropMenuST(false);
    setDefaultTopLabel(language.topMenuTranslation);
    setTopMenuLabel(language.topMenuTranslation);
    get8028TopMenu(language.code);
  };

  const selectTopMenu = (topMenu) => {
    setShowLanguageOptions(false);
    setShowTopMenu(false);
    setShowMainMenu(true);
    setShowSubMenu(false);
    setShowCropMenu(false);
    setShow8CropMenu(false);
    setShowAltitudeMenu(false);
    setShowSoilTypeMenu(false);
    // setMainMenuLabel(topMenu.displayName);
    setTopMenuLabel(topMenu.displayName);
    setTopMainMenuCode(topMenu.code8028);
    setShowTopMenuLabel(true);
    // setShowMainMenuLabel(true);
    get8028MainMenu(topMenu.id);
  };

  const selectMainMenu = (mainMenu) => {
    setShowLanguageOptions(false);
    setShowTopMenu(false);
    setShowMainMenu(false);
    setMainMenuLabel(mainMenu.displayName);
    setMainMenuCode(mainMenu.code);
    setShowMainMenuLabel(true);
    setShowAltitudeMenu(false);
    setShowSoilTypeMenu(false);
    setShowHHICropMenuST(false);
    if (mainMenu.nextMenu == "subMenu") {
      setShowSubMenu(true);
      setShowCropMenu(false);
      setShow8CropMenu(false);
      get8028SubMenu(mainMenu.id);
    } else if (mainMenu.nextMenu == "8cropMenu") {
      setShowSubMenu(false);
      setShowCropMenu(false);
      setShow8CropMenu(true);
      setSubMenuCode(0);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      const cropCodes = [1, 2, 3, 6, 7, 8, 11, 14];
      const typeOfCrop = 1;
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (mainMenu.nextMenu == "HHICropMenuM") {
      setShowSubMenu(false);
      setShowCropMenu(false);
      setShow8CropMenu(false);
      setShowHHICropMenuM(true);
      setSubMenuCode(0);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      const cropCodes = [1, 2, 3, 4, 5, 6, 7];
      const typeOfCrop = 2;
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    }
  };

  const selectSubMenu = (subMenu) => {
    setShowLanguageOptions(false);
    setShowTopMenu(false);
    setShowMainMenu(false);
    setShowSubMenu(false);
    setShow8CropMenu(false);
    setSubMenuLabel(subMenu.displayName);
    setSubMenuCode(subMenu.code);
    setShowSubMenuLabel(true);
    setShowAltitudeMenu(false);
    setShowSoilTypeMenu(false);
    setShowHHICropMenuST(false);
    cropCodes = [];
    typeOfCrop = 1;
    if (subMenu.nextMenu == "cropMenu") {
      setShowCropMenu(true);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      cropCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (subMenu.nextMenu == "soCropMenu") {
      setShowCropMenu(true);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      cropCodes = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (subMenu.nextMenu == "so12CropMenu") {
      setShowCropMenu(true);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      cropCodes = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (subMenu.nextMenu == "13cropMenu") {
      setShowCropMenu(true);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      cropCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (subMenu.nextMenu == "1cropMenu") {
      setShowCropMenu(true);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      if (
        subMenu.code == 3 &&
        [7, 8, 9, 10, 11, 12].includes(subMenu.mainMenuId)
      ) {
        cropCodes = [5];
      } else if (
        subMenu.code == 4 &&
        [7, 8, 9, 10, 11, 12].includes(subMenu.mainMenuId)
      ) {
        cropCodes = [4];
      }
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (subMenu.nextMenu == "HHICropMenu") {
      setShowHHICropMenu(true);
      setAltitudeCode(0);
      setSoilTypeCode(0);
      cropCodes = [1, 2, 3, 4, 5, 6, 7];
      typeOfCrop = 2;
      get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
    } else if (subMenu.nextMenu == "altitudeMenu") {
      setShowAltitudeMenu(true);
      get8028AltitudeMenu(selectedLanguageCode);
    } else if (subMenu.nextMenu == "LivestockMenu") {
      setShowLivestockMenu(true);
      get8028LivestockMenu(subMenu.id, 1);
    } else {
      setShowAudioPlayer(true);
      get8028Content(subMenu, "SubMenu");
      setBackingCropList("SubMenu");
    }
  };

  const selectLivestockMenu = (livestockMenu) => {
    setShowLanguageOptions(false);
    setShowTopMenu(false);
    setShowMainMenu(false);
    setShowSubMenu(false);
    setShow8CropMenu(false);
    setLivestockMenuLabel(livestockMenu.displayName);
    setShowLivestockMenuLabel(true);
    setLivestockMenuCode(livestockMenu.code);
    if (livestockMenu.nextMenu == "livestockSubMenu") {
      setShowLivestockSubMenu(true);
      setShowLivestockMenu(false);
      get8028LivestockMenu(livestockMenu.id, 2);
    } else {
      get8028Content(livestockMenu, "LivestockMenu");
      setShowLivestockMenu(false);
      setShowAudioPlayer(true);
      setBackingCropList("LivestockMenu");
    }
  };

  const selectLivestockSubMenu = (livestockSubMenu) => {
    setShowLanguageOptions(false);
    setShowTopMenu(false);
    setShowMainMenu(false);
    setShowSubMenu(false);
    setShow8CropMenu(false);
    setShowLivestockSubMenu(false);
    setLivestockSubMenuLabel(livestockSubMenu.displayName);
    setLivestockSubMenuCode(livestockSubMenu.code);
    setShowLivestockSubMenuLabel(true);
    get8028Content(livestockSubMenu, "LivestockSubMenu");
    setShowAudioPlayer(true);
    setBackingCropList("LivestockSubMenu");
  };

  const selectAltitudeMenu = (altitudeMenu) => {
    setShowLanguageOptions(false);
    setShowTopMenu(false);
    setShowMainMenu(false);
    setShowSubMenu(false);
    setShow8CropMenu(false);
    setAltitudeMenuLabel(altitudeMenu.displayName);
    setAltitudeCode(altitudeMenu.code);
    setShowAltitudeMenuLabel(true);
    setShowHHICropMenuST(false);
    setShowAltitudeMenu(false);
    setShowSoilTypeMenu(true);
    get8028SoilTypeMenu(selectedLanguageCode);
  };

  const selectCropMenu = (selectedCrop, backCropList) => {
    setBackingCropList(backCropList);
    // setCropCode(selectedCrop.code);
    setShowAudioPlayer(true);
    setCropMenuLabel(selectedCrop.displayName);
    if (backCropList == "Full HHI ST Crop") {
      setShowSoilTypeCropMenuLabel(true);
    } else {
      setShowCropMenuLabel(true);
    }
    setShowCropMenu(false);
    setShow8CropMenu(false);
    setShowHHICropMenu(false);
    setShowHHICropMenuM(false);
    setShowHHICropMenuST(false);

    get8028Content(selectedCrop, "Crop");
  };

  const selectSoilTypeMenu = (soilTypeMenu) => {
    setShowSoilTypeMenu(false);
    setSoilTypeMenuLabel(soilTypeMenu.displayName);
    setSoilTypeCode(soilTypeMenu.code);
    setShowSoilTypeMenuLabel(true);
    setShowHHICropMenuST(true);
    cropCodes = [1, 2, 3, 4, 5, 6, 7];
    typeOfCrop = 2;
    get8028CropMenu(selectedLanguageCode, typeOfCrop, cropCodes);
  };

  const get8028Content = async (selectedCrop, caller) => {
    // console.log("---==== Get 8028 Content ====---");
    // console.log("Selected Language: ", languageCode);
    // console.log("Selected Top Menu:", topMainMenuCode);
    // console.log("Selected Main Menu: ", mainMenuCode);
    // console.log("Selected Sub Menu: ", subMenuCode);
    // console.log("Selected Livestock Menu: ", livestockMenuCode);
    // console.log("Selected Livestock Sub Menu: ", livestockSubMenuCode);
    // console.log("Selected Altitude: ", altitudeCode);
    // console.log("Selected Soil Type: ", soilTypeCode);
    // console.log("Selected Crop Code: ", cropCode);
    // console.log("Selected Crop Code 8028: ", selectedCrop.code8028);
    setLoadingMenu(true);
    livestockCode = livestockMenuCode;
    crop8028Code = 0;
    subMenu_code = subMenuCode;
    switch (caller) {
      case "SubMenu":
        subMenu_code = selectedCrop.code;
        livestockCode = 0;
        break;
      case "LivestockMenu":
        livestockCode = selectedCrop.code;
        crop8028Code = 0;
        break;
      case "LivestockSubMenu":
        crop8028Code = selectedCrop.code;
        break;
      default:
        crop8028Code = selectedCrop.code8028;
        break;
    }
    // console.log("---==== Get 8028 Content ====---");
    // console.log("Caller: ", caller);
    // console.log("Selected: ", selectedCrop);
    // console.log("Selected Language: ", language8028Code);
    // console.log("Selected Top Menu:", topMainMenuCode);
    // console.log("Selected Main Menu: ", mainMenuCode);
    // console.log("Selected Sub Menu: ", subMenu_code);
    // console.log("Selected Livestock Menu: ", livestockCode);
    // console.log("Selected Livestock Sub Menu: ", livestockSubMenuCode);
    // console.log("Selected Altitiude: ", altitudeCode);
    // console.log("Selected Soil Type: ", soilTypeCode);
    // console.log("Selected Crop Code: ", crop8028Code);
    try {
      fetch(
        `${BASE_URL}/api/8028_audio_contents/${language8028Code}/${topMainMenuCode}/${mainMenuCode}/${subMenu_code}/${livestockCode}/${altitudeCode}/${soilTypeCode}/${crop8028Code}`,
      )
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          if (json.length > 0) {
            set_8028AudioContent(`${BASE_URL}/${json[0].contentFile}`);
            set_8028ContentPlayedLog(json[0].contentPlayedLog);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error Fetching 8028 Audio Content:", error);
    }
  };

  const get8028TopMenu = async (languagCode) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_top_menus/${languagCode}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            const processed = {
              ...item,
            };

            set_8028TopMenus((prev) => [...prev, processed]);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const get8028MainMenu = async (topMenuId) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_main_menus/${topMenuId}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            const processed = {
              ...item,
            };

            set_8028MainMenus((prev) => [...prev, processed]);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const get8028SubMenu = async (mainMenuId) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_sub_menus/${mainMenuId}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            const processed = {
              ...item,
            };

            set_8028SubMenus((prev) => [...prev, processed]);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const get8028CropMenu = async (languageCode, typeOfCrop, cropCodes) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_crop_menus/${languageCode}/${typeOfCrop}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            if (cropCodes.includes(item.code)) {
              const processed = {
                ...item,
              };

              set_8028CropMenus((prev) => [...prev, processed]);
            }
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const get8028AltitudeMenu = async (languageCode) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_altitude_menus/${languageCode}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            const processed = {
              ...item,
            };

            set_8028AltitudeMenus((prev) => [...prev, processed]);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const get8028SoilTypeMenu = async (languageCode) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_soil_type_menus/${languageCode}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            const processed = {
              ...item,
            };

            set_8028SoilTypeMenus((prev) => [...prev, processed]);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const get8028LivestockMenu = async (subMenuId, typeOfMenu) => {
    setLoadingMenu(true);
    try {
      fetch(`${BASE_URL}/api/8028_livestock_menus/${subMenuId}/${typeOfMenu}`)
        .then((res) => res.json())
        .then((json) => {
          setLoadingMenu(false);
          for (const item of json) {
            const processed = {
              ...item,
            };
            if (typeOfMenu == 1) {
              set_8028LivestockMenus((prev) => [...prev, processed]);
            } else {
              set_8028LivestockSubMenus((prev) => [...prev, processed]);
            }
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoadingMenu(false);
        });
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const getBackToPrevious = (currentMenu) => {
    switch (currentMenu) {
      case "TopMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(true);
        set_8028TopMenus([]);
        break;
      case "MainMenu":
        setShowTopMenu(true);
        setShowLanguageOptions(false);
        setShowTopMenuLabel(false);
        setTopMenuLabel(defaultTopLabel);
        setShowMainMenu(false);
        setShowMainMenuLabel(false);
        set_8028MainMenus([]);
        break;

      case "SubMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(true);
        setShowSubMenu(false);
        setShowMainMenuLabel(false);
        setMainMenuLabel("");
        set_8028SubMenus([]);
        break;

      case "8CropMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(true);
        setShowMainMenuLabel(false);
        setMainMenuLabel("");
        setShowSubMenu(false);
        setShowSubMenuLabel(false);
        setShowCropMenu(false);
        setShow8CropMenu(false);
        setShowCropMenuLabel(false);
        set_8028CropMenus([]);
        break;

      case "CropMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(false);
        setShowSubMenu(true);
        setShowSubMenuLabel(false);
        setSubMenuLabel("");
        setShowCropMenu(false);
        setShow8CropMenu(false);
        setShowCropMenuLabel(false);
        set_8028CropMenus([]);
        break;

      case "HHICropMenuM":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(true);
        setShowMainMenuLabel(false);
        setMainMenuLabel("");
        setShowSubMenu(false);
        setShowSubMenuLabel(false);
        setShowCropMenu(false);
        setShow8CropMenu(false);
        setShowCropMenuLabel(false);
        setShowHHICropMenuM(false);
        set_8028CropMenus([]);
        break;

      case "HHICropMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(false);
        setShowSubMenu(true);
        setShowSubMenuLabel(false);
        setSubMenuLabel("");
        setShowCropMenu(false);
        setShow8CropMenu(false);
        setShowCropMenuLabel(false);
        setShowHHICropMenu(false);
        set_8028CropMenus([]);
        break;

      case "HHICropMenuST":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowSoilTypeMenu(true);
        setShowSoilTypeMenuLabel(false);
        setSoilTypeMenuLabel("");
        set_8028CropMenus([]);
        break;

      case "LivestockMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(false);
        setShowSubMenu(true);
        setShowSubMenuLabel(false);
        setSubMenuLabel("");
        setShowLivestockMenu(false);
        setShowLivestockMenuLabel(false);
        setLivestockMenuLabel("");
        set_8028LivestockMenus([]);
        setShowAudioPlayer(false);
        break;

      case "LivestockSubMenu":
        setShowLivestockMenu(true);
        setShowLivestockSubMenu(false);
        setShowLivestockSubMenuLabel(false);
        setShowLivestockMenuLabel(false);
        setLivestockSubMenuLabel("");
        set_8028LivestockSubMenus([]);
        setShowAudioPlayer(false);
        break;

      case "AltitudeMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(false);
        setShowSubMenu(true);
        setShowSubMenuLabel(false);
        setSubMenuLabel("");
        setShowCropMenu(false);
        setShow8CropMenu(false);
        setShowCropMenuLabel(false);
        setShowHHICropMenu(false);
        setShowAltitudeMenu(false);
        setShowAltitudeMenuLabel(false);
        setAltitudeMenuLabel("");
        set_8028AltitudeMenus([]);
        break;

      case "SoilTypeMenu":
        setShowTopMenu(false);
        setShowLanguageOptions(false);
        setShowMainMenu(false);
        setShowCropMenu(false);
        setShow8CropMenu(false);
        setShowCropMenuLabel(false);
        setShowHHICropMenu(false);
        setShowHHICropMenuST(false);
        setShowAltitudeMenu(true);
        setShowSoilTypeMenu(false);
        setAltitudeMenuLabel("");
        setShowAltitudeMenuLabel(false);
        set_8028SoilTypeMenus([]);
        break;

      case "AudioPlayer":
        setShowAudioPlayer(false);

        if (backingCropList == "SubMenu") {
          setShowSubMenu(true);
          setShowSubMenuLabel(false);
        }

        if (backingCropList == "Full HHI ST Crop") {
          setShowSoilTypeCropMenuLabel(false);
        } else {
          setShowCropMenuLabel(false);
        }
        setShowCropMenu(backingCropList == "Full Crop" ? true : false);
        setShow8CropMenu(backingCropList == "8 Crop" ? true : false);
        setShowHHICropMenu(backingCropList == "Full HHI Crop" ? true : false);
        setShowHHICropMenuM(
          backingCropList == "Full HHI M Crop" ? true : false,
        );
        setShowHHICropMenuST(
          backingCropList == "Full HHI ST Crop" ? true : false,
        );
        if (backingCropList == "LivestockMenu") {
          setShowLivestockMenu(true);
          setShowLivestockMenuLabel(false);
        }
        if (backingCropList == "LivestockSubMenu") {
          setShowLivestockSubMenu(true);
          setShowLivestockSubMenuLabel(false);
          setBackingCropList("LivestockMenu");
        }
        break;

      default:
        break;
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.servicesCardContainer}>
        {services.map((service) => (
          <View
            key={service.id}
            style={[
              styles.servicesCard,
              {
                backgroundColor: isDark ? "" : "#F9F9F9",
                ShadowColor: isDark ? "white" : "black",
                boxShadow: isDark
                  ? "0 4px 8px rgba(255, 255, 255, 0.5)"
                  : "0 4px 8px rgba(0, 0, 0, 0.5)",
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  styles.serviceName,
                  { color: isDark ? "#fff" : "#102714" },
                ]}
              >
                {service.displayName}
              </Text>
              {service.displayName === "8028" && (
                <Pressable
                  onPress={() => {
                    // setLanguageCode(0);
                    // setTopMainMenuCode(0);
                    // setMainMenuCode(0);
                    // setSubMenuCode(0);
                    // setAltitudeCode(0);
                    // setSoilTypeCode(0);
                    // setCropCode(0);
                    set_8028Languages([]);
                    set_8028TopMenus([]);
                    set_8028MainMenus([]);
                    set_8028SubMenus([]);
                    set_8028CropMenus([]);
                    set_8028LivestockMenus([]);
                    set_8028LivestockSubMenus([]);
                    setShowLanguageOptions(true);
                    setShowTopMenu(false);
                    setShowMainMenu(false);
                    setShowSubMenu(false);
                    setShowLivestockMenu(false);
                    setShowLivestockSubMenu(false);
                    setShowCropMenu(false);
                    setShow8CropMenu(false);
                    setShowHHICropMenu(false);
                    setShowHHICropMenuM(false);
                    setShowAltitudeMenu(false);
                    setShowSoilTypeMenu(false);
                    setShowAudioPlayer(false);
                    setDialerVisible(true);
                    get8028Langages();
                  }}
                >
                  <MaterialIcons
                    name="dialpad"
                    size={24}
                    color={isDark ? "white" : "black"}
                    style={{ opacity: "0.6" }}
                  />
                </Pressable>
              )}
            </View>
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
                  style={{
                    fontFamily: "OutFit",
                    alignItems: "start",
                    color: isDark ? "white" : "#0a7ea4",
                    opacity: isDark ? "0.6" : "1",
                  }}
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
                color: isDark ? "white" : "#102714",
                fontSize: isMobile ? 30 : 40,
              },
            ]}
          >
            No content available.
          </Text>
        )}
      </ScrollView>

      <Modal
        transparent
        visible={isDialerVisible}
        animationType="slide"
        onRequestClose={() => closeModal()}
      >
        <Pressable style={styles.overlay} onPress={() => closeModal()}>
          <Pressable
            style={[
              styles.modalContainer,
              {
                width: isMobile ? "90%" : "40%",
                backgroundColor: isDark ? "#000" : "#fff",
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
              },
            ]}
            onPressIn={() => {}}
          >
            <View style={styles.header}>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Image
                  alt="App Logo"
                  resizeMode="contain"
                  source={ati8028LogoImg}
                />
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      fontSize: isMobile ? 18 : 30,
                      color: isDark ? "#fff" : "#615542",
                    },
                  ]}
                >
                  Farmers' Hotline
                </Text>
              </View>

              <Pressable onPress={() => closeModal()} hitSlop={10}>
                <AntDesign
                  name="closecircle"
                  size={isMobile ? 18 : 24}
                  color={isDark ? "#fff" : "#555"}
                />
              </Pressable>
            </View>

            <View style={{ padding: 10 }}>
              {loadingMenu && <ActivityIndicator />}
              <View
                style={{
                  marginBottom: 20,
                  width: "100%",
                  gap: 10,
                }}
              >
                {showLanguageOptions && (
                  <Text
                    style={[
                      styles.headerTitle,
                      {
                        fontSize: isMobile ? 18 : 20,
                        // color: "#008000",
                        textAlign: "center",
                        color: isDark ? "#fff" : "#008000",
                      },
                    ]}
                  >
                    {languageLabel}
                  </Text>
                )}

                {!showLanguageOptions && (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        getBackToPrevious(
                          showTopMenu
                            ? "TopMenu"
                            : showMainMenu
                              ? "MainMenu"
                              : showSubMenu
                                ? "SubMenu"
                                : show8CropMenu
                                  ? "8CropMenu"
                                  : showCropMenu
                                    ? "CropMenu"
                                    : showHHICropMenuM
                                      ? "HHICropMenuM"
                                      : showHHICropMenu
                                        ? "HHICropMenu"
                                        : showAltitudeMenu
                                          ? "AltitudeMenu"
                                          : showSoilTypeMenu
                                            ? "SoilTypeMenu"
                                            : showHHICropMenuST
                                              ? "HHICropMenuST"
                                              : showAudioPlayer
                                                ? "AudioPlayer"
                                                : showLivestockMenu
                                                  ? "LivestockMenu"
                                                  : showLivestockSubMenu
                                                    ? "LivestockSubMenu"
                                                    : "",
                        )
                      }
                    >
                      <MaterialIcons
                        name="arrow-back"
                        size={isMobile ? 24 : 28}
                        color={isDark ? "#fff" : "#808000"}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.headerTitle,
                          {
                            fontSize: isMobile ? 14 : 16,
                            borderColor: isDark ? "#fff" : "#625641",
                            backgroundColor: isDark ? "#000" : "#CCCFCF",
                            borderWidth: 2,
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            color: isDark ? "#fff" : "#625641",
                          },
                        ]}
                      >
                        {selectedLanguageName}
                      </Text>
                      {showTopMenuLabel ||
                        (showMainMenuLabel && (
                          <FontAwesome
                            name="arrow-circle-right"
                            size={18}
                            color="black"
                          />
                        ))}
                      <Text
                        style={[
                          styles.headerTitle,
                          {
                            fontSize: isMobile ? 14 : 16,
                            borderColor: isDark ? "#fff" : "#009147",
                            backgroundColor: isDark ? "#000" : "#CCCFCF",
                            borderWidth: 2,
                            color: isDark ? "#fff" : "#009147",
                            alignSelf: "center",
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            fontFamily: "OutFitBold",
                          },
                        ]}
                      >
                        {showTopMenu && topMenuLabel}
                        {showTopMenuLabel && topMenuLabel}
                      </Text>
                      {showMainMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderWidth: 2,
                              borderColor: isDark ? "#fff" : "#FAA819",
                              backgroundColor: isDark ? "#000" : "#5E5D5D",
                              // borderWidth: 2,
                              color: isDark ? "#fff" : "#FAA819",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {mainMenuLabel}
                        </Text>
                      )}
                      {showSubMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderWidth: 2,
                              borderColor: isDark ? "#fff" : "#FFDB00",
                              backgroundColor: isDark ? "#000" : "#5E5D5D",
                              // borderWidth: 2,
                              color: isDark ? "#fff" : "#FFDB00",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {subMenuLabel}
                        </Text>
                      )}
                      {showCropMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderColor: isDark ? "#fff" : "#000",
                              backgroundColor: "#000",
                              borderWidth: 2,
                              color: "#fff",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {cropMenuLabel}
                        </Text>
                      )}
                      {showLivestockMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderColor: isDark ? "#fff" : "#000",
                              backgroundColor: "#000",
                              borderWidth: 2,
                              color: "#fff",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {livestockMenuLabel}
                        </Text>
                      )}
                      {showLivestockSubMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderWidth: 2,
                              borderColor: isDark ? "#fff" : "#91AC34",
                              backgroundColor: isDark ? "#000" : "#2E2D2D",
                              // borderWidth: 2,
                              color: isDark ? "#fff" : "#91AC34",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {livestockSubMenuLabel}
                        </Text>
                      )}
                      {showAltitudeMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderWidth: 2,
                              borderColor: isDark ? "#fff" : "#91AC34",
                              backgroundColor: isDark ? "#000" : "#2E2D2D",
                              // borderWidth: 2,
                              color: isDark ? "#fff" : "#91AC34",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {altitudeMenuLabel}
                        </Text>
                      )}
                      {showSoilTypeMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderColor: isDark ? "#fff" : "#6FCCDD",
                              backgroundColor: isDark ? "#000" : "#5E5D5D",
                              borderWidth: 2,
                              color: isDark ? "#fff" : "#6FCCDD",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {soilTypeMenuLabel}
                        </Text>
                      )}
                      {showSoilTypeCropMenuLabel && (
                        <Text
                          style={[
                            styles.headerTitle,
                            {
                              fontSize: isMobile ? 14 : 16,
                              borderColor: isDark ? "#fff" : "#000",
                              borderWidth: 2,
                              backgroundColor: "#000",
                              color: "#fff",
                              alignSelf: "center",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            },
                          ]}
                        >
                          {cropMenuLabel}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                <ColorBar3 />
              </View>
            </View>
            <ScrollView
              style={styles.content}
              contentContainerStyle={
                {
                  // paddingBottom: 16,
                  // height: "100%",
                }
              }
              showsVerticalScrollIndicator={false}
            >
              {showLanguageOptions && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028Languages.map((language) => {
                    const iconName =
                      "numeric-" + language.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={language.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: "row",
                            gap: 10,
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectLanguage(language)}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={20}
                          color="#B8FFB8"
                        />
                        <Text style={[styles.cancelText, { fontSize: 16 }]}>
                          {language.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showTopMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028TopMenus.map((topMenu) => {
                    const iconName =
                      "numeric-" + topMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={topMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            gap: 10,
                            width: isMobile ? "80%" : "90%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectTopMenu(topMenu)}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={20}
                          color="#B8FFB8"
                        />
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 16 : 18,
                              borderColor: "#fff",
                              textAlign: "center",
                            },
                          ]}
                        >
                          {topMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showMainMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028MainMenus.map((mainMenu) => {
                    const iconName =
                      "numeric-" + mainMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={mainMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            gap: 10,
                            width: isMobile ? "80%" : "90%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectMainMenu(mainMenu)}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={20}
                          color="#B8FFB8"
                        />
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 16 : 18,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {mainMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showSubMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028SubMenus.map((subMenu) => {
                    const iconName =
                      "numeric-" + subMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={subMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            gap: 10,
                            width: isMobile ? "80%" : "90%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectSubMenu(subMenu)}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={20}
                          color="#B8FFB8"
                        />
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 16 : 18,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {subMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showLivestockMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028LivestockMenus.map((livestockMenu) => {
                    const iconName =
                      "numeric-" + livestockMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={livestockMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            gap: 10,
                            width: isMobile ? "80%" : "90%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectLivestockMenu(livestockMenu)}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={20}
                          color="#B8FFB8"
                        />
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 16 : 18,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {livestockMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showLivestockSubMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028LivestockSubMenus.map((livestockSubMenu) => {
                    const iconName =
                      "numeric-" + livestockSubMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={livestockSubMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            gap: 10,
                            width: isMobile ? "80%" : "90%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectLivestockSubMenu(livestockSubMenu)}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={20}
                          color="#B8FFB8"
                        />
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 16 : 18,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {livestockSubMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showCropMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028CropMenus.map((cropMenu) => {
                    const iconName =
                      "numeric-" + cropMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={cropMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            width: "40%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectCropMenu(cropMenu, "Full Crop")}
                      >
                        {/* <MaterialCommunityIcons
                            name={iconName}
                            size={20}
                            color="#B8FFB8"
                          /> */}
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 18 : 20,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {cropMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {show8CropMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028CropMenus.map((cropMenu) => {
                    const iconName =
                      "numeric-" + cropMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={cropMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            width: "40%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() => selectCropMenu(cropMenu, "8 Crop")}
                      >
                        {/* <MaterialCommunityIcons
                            name={iconName}
                            size={20}
                            color="#B8FFB8"
                          /> */}
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 18 : 20,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {cropMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showHHICropMenu && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028CropMenus.map((cropMenu) => {
                    const iconName =
                      "numeric-" + cropMenu.code + "-box-multiple";

                    return (
                      <TouchableOpacity
                        key={cropMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            width: "40%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() =>
                          selectCropMenu(cropMenu, "Full HHI Crop")
                        }
                      >
                        {/* <MaterialCommunityIcons
                            name={iconName}
                            size={20}
                            color="#B8FFB8"
                          /> */}
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 18 : 20,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {cropMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showHHICropMenuM && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028CropMenus.map((cropMenu) => {
                    return (
                      <TouchableOpacity
                        key={cropMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            width: "40%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() =>
                          selectCropMenu(cropMenu, "Full HHI M Crop")
                        }
                      >
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 18 : 20,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {cropMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showHHICropMenuST && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    width: isMobile ? "90%" : "80%",
                  }}
                >
                  {_8028CropMenus.map((cropMenu) => {
                    return (
                      <TouchableOpacity
                        key={cropMenu.code}
                        style={[
                          styles.cancelBtn,
                          {
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            width: "40%",
                            backgroundColor: isDark ? "#5e5e5a" : "#000080",
                            borderWidth: isDark ? 1 : 0,
                            borderColor: "#5e5e5a",
                          },
                        ]}
                        onPress={() =>
                          selectCropMenu(cropMenu, "Full HHI ST Crop")
                        }
                      >
                        <Text
                          style={[
                            styles.cancelText,
                            {
                              fontSize: isMobile ? 18 : 20,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {cropMenu.displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {showAltitudeMenu && (
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignSelf: "center",
                      gap: 20,
                      flexWrap: "wrap",
                      width: isMobile ? "90%" : "80%",
                    }}
                  >
                    {_8028AltitudeMenus.map((altitudeMenu) => {
                      return (
                        <TouchableOpacity
                          key={altitudeMenu.code}
                          style={[
                            styles.cancelBtn,
                            {
                              flexDirection: "row",
                              gap: 10,
                              justifyContent: "center",
                              width: "40%",
                              backgroundColor: isDark ? "#5e5e5a" : "#000080",
                              borderWidth: isDark ? 1 : 0,
                              borderColor: "#5e5e5a",
                            },
                          ]}
                          onPress={() => selectAltitudeMenu(altitudeMenu)}
                        >
                          <Text
                            style={[
                              styles.cancelText,
                              {
                                fontSize: isMobile ? 18 : 20,
                                textAlign: "center",
                              },
                            ]}
                          >
                            {altitudeMenu.displayName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {showSoilTypeMenu && (
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignSelf: "center",
                      gap: 20,
                      flexWrap: "wrap",
                      width: isMobile ? "90%" : "80%",
                    }}
                  >
                    {_8028SoilTypeMenus.map((soilTypeMenu) => {
                      return (
                        <TouchableOpacity
                          key={soilTypeMenu.code}
                          style={[
                            styles.cancelBtn,
                            {
                              flexDirection: "row",
                              gap: 10,
                              alignItems: "center",
                              backgroundColor: isDark ? "#5e5e5a" : "#000080",
                              borderWidth: isDark ? 1 : 0,
                              borderColor: "#5e5e5a",
                            },
                          ]}
                          onPress={() => selectSoilTypeMenu(soilTypeMenu)}
                        >
                          <Text
                            style={[
                              styles.cancelText,
                              {
                                fontSize: isMobile ? 18 : 20,
                                textAlign: "center",
                              },
                            ]}
                          >
                            {soilTypeMenu.displayName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {showAudioPlayer && (
                <View>
                  {/* <Text>---==== Get 8028 Content ====---</Text>
                  <Text>Selected Language: {languageCode}</Text>
                  <Text>Selected Top Menu: {topMainMenuCode}</Text>
                  <Text>Selected Main Menu: {mainMenuCode}</Text>
                  <Text>Selected Sub Menu: {subMenuCode}</Text>
                  <Text>Selected Altitiude: {altitudeCode}</Text>
                  <Text>Selected Soil Type: {soilTypeCode}</Text>
                  <Text>Selected Crop Code: selectedCrop</Text> */}
                  <Text
                    style={[
                      styles.title,
                      { color: isDark ? "#fff" : "#008000" },
                    ]}
                  >
                    {_8028ContentPlayedLog}
                  </Text>
                  {/* <Animated.View style={{ opacity }}>
                    <Ionicons name="play-circle" size={20} color="#625641" />
                  </Animated.View> */}
                  <Animated.View
                    style={[
                      styles.subTitleContainer,
                      { backgroundColor: isDark ? "#5e5e5a" : "#DB806E" },
                    ]}
                  >
                    {languageCode == 1 ? (
                      <Text style={styles.subTitle}>
                        የኤክስቴንሽን ምክርን ለማዳመጥ ይህንን{" "}
                        <Animated.View style={{ opacity }}>
                          <Ionicons
                            name="play-circle"
                            size={20}
                            color="#fff"
                            style={{ textAlignVertical: "center" }}
                          />
                        </Animated.View>{" "}
                        ይጫኑ።
                      </Text>
                    ) : (
                      <Text style={styles.subTitle}>
                        Press{" "}
                        <Animated.View style={{ opacity }}>
                          <Ionicons
                            name="play-circle"
                            size={20}
                            color="#fff"
                            style={{ textAlignVertical: "center" }}
                          />
                        </Animated.View>{" "}
                        to listen the extension advisory.
                      </Text>
                    )}
                  </Animated.View>

                  <AudioPlayer source={_8028AudioContent} />
                </View>
                // <AudioPlayer source={audioSource} />
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
    // backgroundColor: "#F9F9F9",
    marginHorizontal: 30,
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
    fontSize: 25,
    fontFamily: "OutFit",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "50%",
    height: "100%",
    // backgroundColor: "#f0efe7",
    // backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  /* HEADER */
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#615542",
  },

  /* CONTENT */
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 10,
  },

  /* FOOTER */
  footer: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    gap: 12,
  },

  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    // backgroundColor: "#615542",
    backgroundColor: "#000080",
  },

  cancelText: {
    color: "#fff",
    fontSize: 16,
  },

  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    // marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    // borderColor: "#C0C0C0",
    // borderWidth: 1,
    alignItems: "center",
  },

  submitText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  // Language Card
  languagesCard: {
    gap: 10,
    backgroundColor: "#F9F9F9",
    // marginHorizontal: 30,
    // padding: 15,
    borderRadius: 15,
    ShadowColor: "black",
    ShadowOffset: { width: 0, height: 30 },
    ShadowRadius: 10,
    ShadowOpacity: 0.1,
    elevation: 5,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    marginBottom: 30,
  },

  // Content Played
  title: {
    fontFamily: "OutFitBold",
    fontSize: 20,
    textAlign: "center",
  },

  subTitleContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingTop: 1,
    paddingBottom: 5,
    alignSelf: "center",
    backgroundColor: "#DB806E",
    borderRadius: 20,
  },

  subTitle: {
    fontFamily: "OutFit",
    color: "#fff",
  },
});
