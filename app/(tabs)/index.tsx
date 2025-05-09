import icons from "@/constant/icons"
import images from "@/constant/images"
import { FontAwesome6 } from "@expo/vector-icons"
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Router, useRouter } from "expo-router"
import { IResponseMessageEntity } from "@/types/interface/IResponseWrapper.interface"
import { GlobalService } from "@/service/global.service"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/useToas"

export default function Index(): JSX.Element {
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const router: Router = useRouter()
  const { toastSuccess, toasError } = useToast()

  const initApi = async (): Promise<void> => {
    try {
      const response: IResponseMessageEntity = await GlobalService.initApi()
      toastSuccess(response.message)
    } catch (error: any) {
      toasError(error.response.data.message)
    }
  }

  useEffect((): void => {
    initApi()
  }, [])

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true)
    await initApi()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex flex-row justify-between items-center p-5 mt-4 bg-violet-600 shadow-lg rounded-xl">
          <View>
            <Text className="font-bold text-white text-3xl font-rubik mt-2">
              Hioto
            </Text>
            <Text className="text-violet-200 text-base font-rubik-light">
              Hello, Welcome to Hioto Gokils
            </Text>
          </View>
          <Image source={icons.home} className="w-16 h-16" />
        </View>

        <View className="w-full h-[45rem] flex flex-col justify-center items-center">
          <Image
            source={images.qrCode}
            className="w-[25rem] h-[25rem] mx-auto"
          />
          <TouchableOpacity
            onPress={() => router.push("/scanner")}
            className="flex flex-row justify-center items-center gap-3 bg-violet-500 shadow-lg border border-zinc-200 rounded-full p-4 px-7"
          >
            <FontAwesome6 name="qrcode" size={24} color="white" />
            <Text className="font-bold text-lg text-white">Add Device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
