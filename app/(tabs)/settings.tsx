import images from "@/constant/images";
import { useToast } from "@/hooks/useToas";
import { DeviceService } from "@/service/device.service";
import { EDevice } from "@/types/enum/EDevice.enum";
import { IResponseDevice } from "@/types/interface/IDevice.interface";
import { IResponseEntity } from "@/types/interface/IResponseWrapper.interface";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

interface IDropdownFormat {
  label: string;
  value: string;
}

export default function Settings(): JSX.Element {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sensorDevice, setSensorDevice] = useState<IDropdownFormat[]>([]);
  const [aktuatorDevice, setAktuatorDevice] = useState<IDropdownFormat[]>([]);
  const [outputDevice, setOutputDevice] = useState<string[]>([]);

  const { toastSuccess, toasError } = useToast();

  const getAllSensor = async (): Promise<void> => {
    try {
      const response: IResponseEntity<IResponseDevice[]> =
        await DeviceService.getAllDevice(EDevice.SENSOR);

      setSensorDevice(
        response.data.map((data: IResponseDevice) => ({
          label: data.name,
          value: data.guid,
        }))
      );
    } catch (error: any) {
      toasError(error.response.data.message);
    }
  };

  const getAllAktuator = async (): Promise<void> => {
    try {
      const response: IResponseEntity<IResponseDevice[]> =
        await DeviceService.getAllDevice(EDevice.AKTUATOR);

      setAktuatorDevice(
        response.data.map((data: IResponseDevice) => ({
          label: data.name,
          value: data.guid,
        }))
      );
    } catch (error: any) {
      toasError(error.response.data.message);
    }
  };

  const removeOutputDevice = useCallback((guid: string): void => {
    setOutputDevice((prev: string[]) => prev.filter((data) => data !== guid));
  }, []);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await getAllSensor();
    await getAllAktuator();
    setOutputDevice([]);
    setRefreshing(false);
  };

  useEffect(() => {
    getAllSensor();
    getAllAktuator();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-5 bg-violet-500 rounded-md">
          <Text className="font-rubik-extrabold text-xl text-white text-center">
            Create Rules For Devices
          </Text>
        </View>

        <View className="mt-4 flex flex-col gap-y-4">
          <Dropdown
            placeholder="Select Input Device"
            mode="outlined"
            label="Input Device"
            options={sensorDevice}
          />
          <Dropdown
            placeholder="Select Output Device"
            mode="outlined"
            label="Output Device"
            options={aktuatorDevice}
            onSelect={(value: string | undefined) =>
              setOutputDevice((prev: string[]) => {
                if (prev.includes(value!)) return prev;
                return [...prev, value!];
              })
            }
          />
        </View>
        <View className="mt-4">
          {outputDevice.length ? (
            <View className="flex flex-col gap-3">
              <View className="flex flex-col w-full gap-2 border border-zinc-500 rounded-md p-2">
                <Text className="font-rubik-semibold text-violet-500 text-lg">
                  Input Guid
                </Text>
                {outputDevice.map((guid: string, index: number) => (
                  <CardOutputDevice
                    guid={guid}
                    removeOutputDevice={removeOutputDevice}
                    key={index}
                  />
                ))}
              </View>
              <TouchableOpacity className="bg-violet-600 p-3 flex flex-row gap-2 justify-center items-end rounded-md">
                <MaterialIcons name="rule" size={24} color="white" />
                <Text className="font-rubik-bold text-xl text-white">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex flex-col w-full items-center">
              <Image source={images.notfound} className="size-96" />
              <Text className="font-rubik-extrabold text-red-500 text-5xl">
                Oops!
              </Text>
              <Text className="font-rubik-medium text-black-200 text-xl">
                Belum Ada Output Device yang dipilih
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ChildProps {
  guid: string;
  removeOutputDevice: (guid: string) => void;
}

const CardOutputDevice: React.FC<ChildProps> = ({
  guid,
  removeOutputDevice,
}) => {
  return (
    <View className="p-3 rounded bg-slate-200 flex flex-row justify-between items-center">
      <Text className="font-rubik-semibold text-black-300">{guid}</Text>
      <TouchableOpacity className="bg-red-500 rounded">
        <MaterialCommunityIcons
          name="close"
          size={24}
          color="white"
          onPress={() => removeOutputDevice(guid)}
        />
      </TouchableOpacity>
    </View>
  );
};
