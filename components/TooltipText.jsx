// import { useColorScheme } from "@/hooks/useColorScheme";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { useState } from "react";
// import {
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
// } from "react-native";

// export default function TooltipText({
//   localVideoTitle,
//   localLocation,
//   videoTitle,
//   location,
// }) {
//   const { width, height } = useWindowDimensions();
//   const isMobile = width < 480;
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === "dark";
//   const [showTooltip, setShowTooltip] = useState(false);

//   return (
//     <View
//       style={styles.container}
//     >
//       <Pressable
//         // onHoverIn={() => setShowTooltip(true)}
//         // onHoverOut={() => setShowTooltip(false)}
//         onHoverIn={() => {
//           if (Platform.OS === "web") setShowTooltip(true);
//         }}
//         onHoverOut={() => {
//           if (Platform.OS === "web") setShowTooltip(false);
//         }}
//         onPress={() => {
//           if (Platform.OS !== "web") {
//             setShowTooltip((prev) => !prev);
//           }
//         }}
//       >
//         <Text
//           numberOfLines={1}
//           style={[styles.text, { color: isDark ? "#fff" : "#102714" }]}
//         >
//           {localVideoTitle}
//         </Text>

//       </Pressable>

//       {showTooltip && (
//         <View
//           style={[
//             styles.tooltip,
//             {
//               gap: 5,
//               ShadowColor: isDark ? "white" : "black",
//               boxShadow: isDark
//                 ? "0 4px 8px rgba(255, 255, 255, 0.5)"
//                 : "0 4px 8px rgba(0, 0, 0, 0.5)",
//               borderWidth: isDark ? 1 : 0,
//               borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
//               backgroundColor: isDark ? "#323232" : "#009147",
//             },
//           ]}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 10,
//               borderWidth: 1,
//               borderRadius: 5,
//               borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
//               padding: 2,
//             }}
//           >
//             <MaterialCommunityIcons
//               name="video-check"
//               size={20}
//               color="#fff"
//               style={{ alignSelf: "center" }}
//             />
//             <Text style={[styles.tooltipText, { alignContent: "center" }]}>
//               {localVideoTitle}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 10,
//               borderWidth: 1,
//               borderRadius: 5,
//               borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
//               padding: 2,
//             }}
//           >
//             <MaterialCommunityIcons
//               name="video-marker"
//               size={20}
//               color="#fff"
//               style={{ alignSelf: "center" }}
//             />
//             <Text style={styles.tooltipText}>{localLocation}</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 10,
//               borderWidth: 1,
//               borderRadius: 5,
//               borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
//               padding: 2,
//             }}
//           >
//             <MaterialCommunityIcons
//               name="video-check"
//               size={20}
//               color="#fff"
//               style={{ alignSelf: "center" }}
//             />
//             <Text style={[styles.tooltipText, { alignContent: "center" }]}>
//               {videoTitle}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 10,
//               borderWidth: 1,
//               borderRadius: 5,
//               borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
//               padding: 2,
//             }}
//           >
//             <MaterialCommunityIcons
//               name="video-marker"
//               size={20}
//               color="#fff"
//               style={{ alignSelf: "center" }}
//             />
//             <Text style={styles.tooltipText}>{location}</Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignSelf: "flex-start",
//     zIndex: 9999,
//     elevation: 10,
//   },
//   text: {
//     fontSize: 18,
//     color: "#615542",
//     fontFamily: "OutFitBold",
//   },
//   tooltip: {
//     position: "absolute",
//     top: "100%",
//     // bottom: 0,
//     left: 0,
//     backgroundColor: "#333",
//     padding: 8,
//     borderRadius: 6,
//     minWidth: 200,
//     zIndex: 10000,
//     elevation: 11,
//   },
//   tooltipText: {
//     color: "#fff",
//     fontSize: 12,
//     fontFamily: "OutFit",
//   },
// });

import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export default function TooltipText({
  localVideoTitle,
  localLocation,
  videoTitle,
  location,
}) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [showTooltip, setShowTooltip] = useState(false);

  // Responsive tooltip width
  const tooltipWidth = Math.min(width - 32, 320);

  const renderRow = (icon, value) => (
    <View style={styles.tooltipRow}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color="#fff"
        style={styles.rowIcon}
      />

      <Text style={styles.tooltipText}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { width: 250 }]}>
      <Pressable
        onHoverIn={() => {
          if (Platform.OS === "web") setShowTooltip(true);
        }}
        onHoverOut={() => {
          if (Platform.OS === "web") setShowTooltip(false);
        }}
        onPress={() => {
          if (Platform.OS !== "web") {
            setShowTooltip((prev) => !prev);
          }
        }}
      >
        <Text
          numberOfLines={1}
          style={[styles.text, { color: isDark ? "#fff" : "#102714" }]}
        >
          {/* {localVideoTitle} */}
          {localVideoTitle || videoTitle}
        </Text>
      </Pressable>

      {showTooltip && (
        <View
          style={[
            styles.tooltip,
            {
              width: tooltipWidth,
              backgroundColor: isDark ? "#323232" : "#009147",
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
              boxShadow: isDark
                ? "0 4px 8px rgba(255, 255, 255, 0.5)"
                : "0 4px 8px rgba(0, 0, 0, 0.5)",
            },
          ]}
        >
          {renderRow("video-check", localVideoTitle)}
          {renderRow("video-marker", localLocation)}
          {renderRow("video-check", videoTitle)}
          {renderRow("video-marker", location)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start",
    zIndex: 9999,
    elevation: 10,
  },

  text: {
    fontSize: 18,
    fontFamily: "OutFitBold",
    flexShrink: 1,
  },

  tooltip: {
    position: "absolute",
    top: "100%",
    left: 0,
    padding: 8,
    borderRadius: 6,
    zIndex: 10000,
    elevation: 11,
    gap: 5,
  },

  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#e2e0d8",
    padding: 5,
    width: "100%",
  },

  rowIcon: {
    flexShrink: 0,
  },

  tooltipText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "OutFit",
    flex: 1,
    flexShrink: 1,
  },
});
