import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { IRegisterDevicePayload } from "@/types/interface/IDevice.interface";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterDevice = () => {
  const data = useLocalSearchParams();
  const payload: IRegisterDevicePayload =
    data as unknown as IRegisterDevicePayload;

  console.log(payload.guid);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Stack.Screen
        options={{
          title: "Register Device",
        }}
      />
      <Text>{payload.guid}</Text>
    </SafeAreaView>
  );
};

export default RegisterDevice;
