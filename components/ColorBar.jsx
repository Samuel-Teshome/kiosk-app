import { View, useWindowDimensions } from "react-native";

const ColorBar = () => {
  return (
    <View className="flex-row">
      <View className="w-[30%] h-[7px] bg-[#635642]/100 dark:bg-[#635642]/60"></View>
      <View className="w-[30%] h-[7px] bg-[#009347]/100 dark:bg-[#009347]/60"></View>
      <View className="w-[20%] h-[7px] bg-[#FBA817]/100 dark:bg-[#FBA817]/60"></View>
      <View className="w-[7%] h-[7px] bg-[#FFDC05]/100 dark:bg-[#FFDC05]/60"></View>
      <View className="w-[7%] h-[7px] bg-[#90AC35]/100 dark:bg-[#90AC35]/60"></View>
      <View className="w-[6%] h-[7px] bg-[#6FCDDD]/100 dark:bg-[#6FCDDD]/60"></View>
    </View>
  );
};

export default ColorBar;

// #635642   #635642  #625641
// #009347   #029248  #009147
// #FBA817   #F9AA1F  #FAA819
// #FFDC05   #FEDC0A  #FFDB00
// #90AC37   #90AC35  #91AC34
// #6FCDDD   #70CCDC  #6FCCDD

export const ColorBar2 = () => {
  return (
    <View className="flex-row">
      <View className="w-[30%] h-[5px] bg-[#635642]/100 dark:bg-[#635642]/60"></View>
      <View className="w-[30%] h-[5px] bg-[#009347]/100 dark:bg-[#009347]/60"></View>
      <View className="w-[20%] h-[5px] bg-[#FBA817]/100 dark:bg-[#FBA817]/60"></View>
      <View className="w-[7%] h-[5px] bg-[#FFDC05]/100 dark:bg-[#FFDC05]/60"></View>
      <View className="w-[7%] h-[5px] bg-[#90AC35]/100 dark:bg-[#90AC35]/60"></View>
      <View className="w-[6%] h-[5px] bg-[#6FCDDD]/100 dark:bg-[#6FCDDD]/60"></View>
    </View>
  );
};

export const ColorBar3 = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 480;
  return (
    <View style={{ flexDirection: "row", alignSelf: "center" }}>
      <View
        style={{
          backgroundColor: "#625641",
          width: isMobile ? 150 : 200,
          height: 5,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "#009147",
          width: isMobile ? 150 : 200,
          height: 5,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "#FAA819",
          width: isMobile ? 84 : 134,
          height: 5,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "#FFDB00",
          width: isMobile ? 20 : 47,
          height: 5,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "#91AC34",
          width: isMobile ? 20 : 47,
          height: 5,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "#6FCCDD",
          width: isMobile ? 15 : 40,
          height: 5,
        }}
      ></View>
    </View>
  );
};
