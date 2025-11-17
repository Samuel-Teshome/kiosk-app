import { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const CustomDropdown = ({
  items,
  value,
  setValue,
  placeholder,
  zIndex,
  zIndexInverse,
}) => {
  const [open, setOpen] = useState(false);
  const [listItems, setItems] = useState(items);

  return (
    <View
      style={[
        styles.wrapper,
        open ? { zIndex: zIndex } : { zIndex: zIndexInverse },
      ]}
    >
      <DropDownPicker
        open={open}
        value={value}
        items={listItems}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        style={styles.dropdown}
        textStyle={styles.text}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemLabelStyle={styles.itemLabel}
        selectedItemLabelStyle={styles.selectedItem}
        listMode="SCROLLVIEW"
        scrollViewProps={{ nestedScrollEnabled: true }}
      />
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
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
    maxHeight: 200, // ✅ makes dropdown scrollable
  },
  itemLabel: {
    fontSize: 14,
  },
  selectedItem: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
