import { useColorScheme } from "@/hooks/useColorScheme";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

const STORAGE_KEY = "kioskLanguage";

const languages = [
  { label: "English", value: "en" },
  { label: "Amharic", value: "am" },
  { label: "Afan Oromo", value: "om" },
  { label: "Tigriyna", value: "ti" },
  //   { label: "Somali", value: "so" },
  //   { label: "Sidamigna", value: "sid" },
  //   { label: "Wolayttigna", value: "wal" },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const languageValue = i18n.resolvedLanguage || i18n.language;

  const [visible, setVisible] = useState(false);

  useEffect(() => {}, []);

  return (
    <View>
      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        style={[
          styles.trigger,
          {
            backgroundColor: isDark ? "#333333" : "#EAF2FF",
            borderWidth: 1,
            borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
          },
        ]}
        title="Change Language"
      >
        <FontAwesome
          name="language"
          size={18}
          color={isDark ? "white" : "#1769D2"}
          style={{ opacity: isDark ? "0.5" : "1" }}
        />

        <Text
          style={[
            styles.triggerText,
            {
              color: isDark ? "white" : "#17365D",
              opacity: isDark ? "0.5" : "1",
            },
          ]}
        >
          {t(`header.language.${languageValue}.code`).toUpperCase()}
        </Text>

        <Feather
          name="chevron-down"
          size={16}
          color={isDark ? "white" : "#17365D"}
          style={{ opacity: isDark ? "0.5" : "1" }}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor: isDark ? "#131313" : "#fff",
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <Text
              style={[styles.title, { color: isDark ? "#fff" : "#615542" }]}
            >
              {t("header.language.select")}
            </Text>

            {languages.map((item) => {
              const selected = languageValue === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={async () => {
                    await i18n.changeLanguage(item.value);

                    try {
                      localStorage.setItem("kioskLanguage", item.value);
                    } catch (error) {
                      console.warn(
                        "Could not save language preference:",
                        error,
                      );
                    }

                    setVisible(false);
                  }}
                  style={[
                    styles.option,
                    {
                      borderWidth: selected ? 1 : 0,
                      borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: selected
                          ? isDark
                            ? "#FFFFFF"
                            : "#615542"
                          : isDark
                            ? "#E0E0E0"
                            : "#615542",
                        fontWeight: selected ? "600" : "400",
                      },
                    ]}
                  >
                    {t(`header.language.${item.value}.title`)}
                  </Text>

                  {selected && (
                    <Feather
                      name="check"
                      size={18}
                      color={isDark ? "#fff" : "#1769D2"}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    cursor: "pointer",
  },
  triggerText: {
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 65,
    paddingRight: 16,
  },
  menu: {
    width: 180,
    borderRadius: 12,
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    padding: 10,
  },
  option: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 15,
  },
});
