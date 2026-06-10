// import { Host, Slider } from "@expo/ui/swift-ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AudioPlayer({ source }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const player = useAudioPlayer(source);
  const playerStatus = useAudioPlayerStatus(player);

  // Play / Pause
  const togglePlayPause = () => {
    if (playerStatus.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // Seek
  const onSeek = (value) => {
    player.seekTo(value / 1000);
  };

  // Format time
  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Play / Pause */}
        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons
            name={playerStatus.playing ? "pause-circle" : "play-circle"}
            size={64}
            color={isDark ? "#fff" : "#625641"}
          />
        </TouchableOpacity>

        {/* Slider */}
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={playerStatus.duration * 1000}
          value={playerStatus.currentTime * 1000}
          onSlidingComplete={onSeek}
          minimumTrackTintColor={isDark ? "#5e5e5a" : "#009147"}
          maximumTrackTintColor={isDark ? "#fff" : "#91AC34"}
          thumbTintColor={isDark ? "#5e5e5a" : "#009147"}
        />
      </View>
      {/* Timer */}
      <View
        style={[
          styles.timeRow,
          {
            backgroundColor: isDark ? "#323232" : "rgba(111, 204, 221, 0.6)",
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#5e5e5a" : "#e2e0d8",
          },
        ]}
      >
        <Text
          style={[styles.textStyle, { color: isDark ? "#fff" : "#625641" }]}
        >
          {formatTime((playerStatus.currentTime || 0) * 1000)}
        </Text>
        <Text
          style={[styles.textStyle, { color: isDark ? "#fff" : "#625641" }]}
        >
          /
        </Text>
        <Text
          style={[styles.textStyle, { color: isDark ? "#fff" : "#625641" }]}
        >
          {formatTime((playerStatus.duration || 0) * 1000)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 20,
  },
  container: {
    alignItems: "center",
  },
  timeRow: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    gap: 5,
    alignSelf: "end",
    borderRadius: 20,
    backgroundColor: "rgba(111, 204, 221, 0.6)",
  },
  textStyle: {
    fontFamily: "OutFit",
    color: "#625641",
  },
});
