import { View, Text, StyleSheet } from "react-native"
import React, { useState } from "react"
import {
  Router,
  Stack,
  UnknownOutputParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router"
import {
  IRegisterDeviceDto,
  IRegisterDevicePayload,
  IResponseDevice,
} from "@/types/interface/IDevice.interface"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, HelperText, TextInput } from "react-native-paper"
import { z } from "zod"
import { registerDeviceSchema } from "@/schema/deviceSchema"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EDevice } from "@/types/enum/EDevice.enum"
import { IResponseEntity } from "@/types/interface/IResponseWrapper.interface"
import { DeviceService } from "@/service/device.service"
import { ActivityIndicator, MD2Colors } from "react-native-paper"
import { useToast } from "@/hooks/useToas"
import { Dropdown } from "react-native-element-dropdown"

type RegisterDeviceSchema = z.infer<typeof registerDeviceSchema>

const RegisterDevice: React.FC = (): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const { toastSuccess, toasError } = useToast()

  const router: Router = useRouter()

  const data: UnknownOutputParams = useLocalSearchParams()
  const payload: IRegisterDevicePayload =
    data as unknown as IRegisterDevicePayload

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDeviceSchema>({
    resolver: zodResolver(registerDeviceSchema),
  })

  const onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> =
    handleSubmit(async (data: RegisterDeviceSchema): Promise<void> => {
      setLoading(true)

      setTimeout(async (): Promise<void> => {
        try {
          const payload: IRegisterDeviceDto = {
            guid: data.guid,
            mac: data.mac,
            type: data.type,
            quantity: parseInt(data.quantity),
            name: data.name,
            version: data.version,
            minor: data.minor,
          }

          const response: IResponseEntity<IResponseDevice> =
            await DeviceService.registerDevice(payload)

          toastSuccess(response.message)

          router.push("/")
        } catch (error: any) {
          toasError(error.response.data.message)
        }
        setLoading(false)
      }, 2000)
    })

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Stack.Screen
        options={{
          title: "Register Device",
        }}
      />
      <View className="mt-4 flex flex-col gap-5 w-full">
        <Controller
          name="guid"
          control={control}
          defaultValue={payload.guid}
          render={({ field }) => (
            <View>
              <TextInput
                {...field}
                mode="outlined"
                label="Guid"
                error={!!errors.guid}
                disabled
              />
              {errors.guid && (
                <HelperText type="error">{errors.guid?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          name="mac"
          control={control}
          defaultValue={payload.mac}
          render={({ field }) => (
            <View>
              <TextInput
                {...field}
                mode="outlined"
                label="Mac Address"
                error={!!errors.mac}
                disabled
              />
              {errors.mac && (
                <HelperText type="error">{errors.mac?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Dropdown
                style={[
                  style.dropdown,
                  { borderColor: errors.type ? "red" : "#7c3aed" },
                ]}
                placeholder="Select Type"
                data={[
                  { label: "Actuator", value: EDevice.AKTUATOR },
                  { label: "Sensor", value: EDevice.SENSOR },
                ]}
                onChange={(item) => {
                  onChange(item.value)
                }}
                labelField="label"
                valueField="value"
                value={value}
              />
              {errors.type && (
                <HelperText type="error">{errors.type?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          name="quantity"
          control={control}
          defaultValue={payload.quantity}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                mode="outlined"
                label="Quantity"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.quantity}
              />
              {errors.quantity && (
                <HelperText type="error">{errors.quantity?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          name="name"
          control={control}
          defaultValue={payload.name}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                mode="outlined"
                label="Device Name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.name}
              />
              {errors.name && (
                <HelperText type="error">{errors.name?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          name="version"
          control={control}
          defaultValue={payload.version}
          render={({ field }) => (
            <View>
              <TextInput
                {...field}
                mode="outlined"
                label="Mac Address"
                error={!!errors.version}
                disabled
              />
              {errors.version && (
                <HelperText type="error">{errors.version?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          name="minor"
          control={control}
          defaultValue={payload.minor}
          render={({ field }) => (
            <View>
              <TextInput
                {...field}
                mode="outlined"
                label="Minor"
                error={!!errors.minor}
                disabled
              />
              {errors.minor && (
                <HelperText type="error">{errors.minor?.message}</HelperText>
              )}
            </View>
          )}
        />

        <Button
          mode="contained"
          icon={loading ? "" : "arrow-right"}
          style={{
            borderRadius: 10,
            backgroundColor: "#7c3aed",
          }}
          onPress={onSubmit}
          rippleColor="rgba(0, 0, 0, .32)"
        >
          {!loading ? (
            <Text>Register Device</Text>
          ) : (
            <ActivityIndicator animating={true} color={MD2Colors.purple100} />
          )}
        </Button>
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
})

export default RegisterDevice
