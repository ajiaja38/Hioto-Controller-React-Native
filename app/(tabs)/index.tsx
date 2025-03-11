import icons from "@/constant/icons";
import images from "@/constant/images";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Router, useRouter } from "expo-router";

export default function Index() {
  const router: Router = useRouter();

  const onPress = (): void => {
    router.push("/scanner");
  };

  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      <View className="flex flex-row justify-between items-center p-5 mt-4 bg-violet-600 shadow-lg rounded-xl">
        <View>
          <Text className="font-bold text-white text-3xl font-rubik mt-2">
            Hioto
          </Text>
          <Text className="text-violet-200 text-base font-rubik-light">
            Hello, Welcome to Hioto
          </Text>
        </View>
        <Image source={icons.home} className="w-16 h-16" />
      </View>
      <View className="w-full h-[45rem] flex flex-col justify-center items-center">
        <Image source={images.qrCode} className="w-[25rem] h-[25rem] mx-auto" />
        <TouchableOpacity
          onPress={onPress}
          className="flex flex-row justify-center items-center gap-3 bg-violet-500 shadow-lg border border-zinc-200 rounded-full p-4 px-7"
        >
          <FontAwesome6 name="qrcode" size={24} color="white" />
          <Text className="font-bold text-lg text-white">Add New Device</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
