import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function CustomDropdown2({
  title,
  items,
  value,
  setValue,
  placeholder,
  zIndex,
  zIndexInverse,
  labelKey = "name",
  valueKey = "id",
  listMode = "MODAL",
  modalAnimation = "fade",
  maxHeight = 200,
  disabled = false,
  multiple = false,
}) {
  const [open, setOpen] = useState(false);

  const mappedItems = useMemo(() => {
    return items.map((item) => {
      let label;

      if (Array.isArray(labelKey)) {
        label = labelKey
          .map((key) => (item.hasOwnProperty(key) ? item[key] : key))
          .join(" ");
      } else {
        label = item[labelKey];
      }

      return {
        label,
        value: item[valueKey],
        raw: item,
      };
    });
  }, [items, labelKey, valueKey]);

  const colorScheme = useColorScheme();
  const isDark = colorScheme.colorScheme === "dark";

  return (
    <View
      style={[
        styles.wrapper,
        open ? { zIndex: zIndex } : { zIndex: zIndexInverse },
      ]}
    >
      <DropDownPicker
        multiple={multiple}
        min={1}
        mode={multiple ? "BADGE" : "SIMPLE"}
        listMode={listMode}
        scrollViewProps={{
          nestedScrollEnabled: true,
          keyboardShouldPersistTaps: "handled",
        }}
        listItemContainerStyle={{
          paddingVertical: 10,
        }}
        open={open}
        value={value}
        items={mappedItems}
        setOpen={setOpen}
        setValue={setValue}
        placeholder={placeholder}
        disabled={disabled}
        badgeTextStyle={{
          color: isDark ? "#615542" : "#eee",
          fontFamily: "OutFit",
          fontSize: 14,
        }}
        badgeDotColors={isDark ? ["#615542"] : ["#eee"]}
        badgeColors={isDark ? ["#eee"] : ["#615542"]}
        style={[
          styles.dropdown,
          {
            backgroundColor: isDark ? "transparent" : "#fff",
          },
        ]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          listMode === "SCROLLVIEW" && { maxHeight: maxHeight },
        ]}
        textStyle={{
          fontSize: 15,
          fontFamily: "OutFit",
          color: isDark ? "#fff" : "#585858",
        }}
        listItemLabelStyle={{
          color: isDark ? "#585858" : "#fff",
          fontFamily: "OutFit",
        }}
        selectedItemLabelStyle={styles.selectedItem}
        disabledStyle={{
          backgroundColor: isDark ? "#555555" : "#e0e0e0",
          borderColor: isDark ? "#777777" : "#ccc",
        }}
        disabledLabelStyle={{
          color: isDark ? "#aaa" : "#888",
          fontFamily: "OutFit",
        }}
        modalProps={
          listMode === "MODAL"
            ? {
                animationType: modalAnimation,
                transparent: true,
                presentationStyle: "overFullScreen",
              }
            : undefined
        }
        modalContentContainerStyle={
          listMode === "MODAL"
            ? {
                backgroundColor: isDark ? "#fff" : "#3c3c3c",
                maxHeight: 300,
                width: "60%",
                marginHorizontal: "20%",
                marginVertical: "20%",
                borderRadius: 12,
                padding: 10,
              }
            : undefined
        }
        modalTitle={
          listMode === "MODAL" ? (
            <View className="py-3" style={{ paddingVertical: 5 }}>
              <Text
                style={{
                  color: isDark ? "#585858" : "#fff",
                  fontFamily: "OutFitBold",
                  fontSize: 20,
                }}
                className="text-xl font-[OutFitBold] text-[#fff] dark:text-[#585858]"
              >
                {title}
              </Text>
            </View>
          ) : undefined
        }
        ArrowUpIconComponent={() => (
          <Feather
            name="chevron-up"
            size={20}
            color={isDark ? "white" : "#585858"}
          />
        )}
        ArrowDownIconComponent={() => (
          <Feather
            name="chevron-down"
            size={20}
            color={isDark ? "white" : "#585858"}
          />
        )}
        TickIconComponent={() => (
          <Feather name="check" size={20} color={isDark ? "#585858" : "#fff"} />
        )}
        CloseIconComponent={() => (
          <AntDesign
            name="closecircleo"
            size={20}
            color={isDark ? "#585858" : "#fff"}
          />
        )}
      />
    </View>
  );
}

// export default CustomDropdown2;

const styles = StyleSheet.create({
  wrapper: {
    // marginBottom: 16,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    maxHeight: 200,
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: "OutFit",
  },
  selectedItem: {
    color: "#007AFF",
    fontSize: 16,
    fontFamily: "OutFit",
  },
});
