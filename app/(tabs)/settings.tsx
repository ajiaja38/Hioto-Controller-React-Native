import images from "@/constant/images"
import { useToast } from "@/hooks/useToas"
import { createRuleSchema } from "@/schema/ruleSchema"
import { DeviceService } from "@/service/device.service"
import { RuleService } from "@/service/rule.service"
import { EDevice } from "@/types/enum/EDevice.enum"
import { IResponseDevice } from "@/types/interface/IDevice.interface"
import { IResponseEntity } from "@/types/interface/IResponseWrapper.interface"
import {
  ICreateRulesDto,
  IResponseRule,
} from "@/types/interface/IRules.interface"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { ActivityIndicator, MD2Colors } from "react-native-paper"
import { Dropdown } from "react-native-element-dropdown"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"
import { StyleSheet } from "react-native"

interface IDropdownFormat {
  label: string
  value: string
}

type CreateRuleSchema = z.infer<typeof createRuleSchema>

export default function Settings(): JSX.Element {
  const [refreshing, setRefreshing]: [boolean, (value: boolean) => void] =
    useState<boolean>(false)
  const [sensorDevice, setSensorDevice] = useState<IDropdownFormat[]>([])
  const [aktuatorDevice, setAktuatorDevice] = useState<IDropdownFormat[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { toastSuccess, toasError } = useToast()

  const getAllSensor = async (): Promise<void> => {
    try {
      const response: IResponseEntity<IResponseDevice[]> =
        await DeviceService.getAllDevice(EDevice.SENSOR)

      setSensorDevice(
        response.data.map((data: IResponseDevice) => ({
          label: data.name,
          value: data.guid,
        }))
      )
    } catch (error: any) {
      toasError(error.response.data.message)
    }
  }

  const getAllAktuator = async (): Promise<void> => {
    try {
      const response: IResponseEntity<IResponseDevice[]> =
        await DeviceService.getAllDevice(EDevice.AKTUATOR)

      setAktuatorDevice(
        response.data.map((data: IResponseDevice) => ({
          label: data.name,
          value: data.guid,
        }))
      )
    } catch (error: any) {
      toasError(error.response.data.message)
    }
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRuleSchema>({
    resolver: zodResolver(createRuleSchema),
    defaultValues: { inputDevice: "", outputDevices: [] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "outputDevices",
  })

  const onSubmit = handleSubmit(
    async (data: CreateRuleSchema): Promise<void> => {
      setLoading(true)

      setTimeout(async () => {
        try {
          const payload: ICreateRulesDto = {
            input_guid: data.inputDevice,
            output_guid: data.outputDevices.map(
              (data: { value: string }) => data.value
            ),
          }

          const response: IResponseEntity<IResponseRule> =
            await RuleService.createRule(payload)
          toastSuccess(response.message)
          reset({ outputDevices: [] })
        } catch (error: any) {
          toasError(error.response.data.message)
          reset({ outputDevices: [] })
        }
        setLoading(false)
      }, 2000)
    }
  )

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true)
    await getAllSensor()
    await getAllAktuator()
    reset({ outputDevices: [] })

    setRefreshing(false)
  }

  useEffect(() => {
    getAllSensor()
    getAllAktuator()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-5 bg-violet-500 rounded-md">
          <Text className="font-rubik-extrabold text-xl text-white text-center">
            Create Rules For your Device
          </Text>
        </View>

        <View className="mt-4 flex flex-col gap-y-4">
          <View>
            <Controller
              control={control}
              name="inputDevice"
              render={({ field }) => (
                <Dropdown
                  style={[
                    style.dropdown,
                    { borderColor: errors.inputDevice ? "red" : "#7c3aed" },
                  ]}
                  placeholder="Select Input Device"
                  labelField="label"
                  valueField="value"
                  data={sensorDevice}
                  value={field.value}
                  onChange={(item) => field.onChange(item.value)}
                />
              )}
            />
            {errors.inputDevice && (
              <Text className="text-red-500">{errors.inputDevice.message}</Text>
            )}
          </View>
          <View>
            <Controller
              control={control}
              name="outputDevices"
              render={({ field }) => (
                <Dropdown
                  style={[
                    style.dropdown,
                    { borderColor: errors.outputDevices ? "red" : "#7c3aed" },
                  ]}
                  placeholder="Select Output Device"
                  labelField="label"
                  valueField="value"
                  data={aktuatorDevice}
                  onChange={(item) => {
                    if (!fields.find((data) => data.value === item.value)) {
                      append({ value: item.value })
                    }
                  }}
                />
              )}
            />
            {errors.outputDevices && (
              <Text className="text-red-500">
                {errors.outputDevices.message}
              </Text>
            )}
          </View>
        </View>
        <View className="mt-4">
          {fields.length ? (
            <View className="flex flex-col gap-3">
              <View className="flex flex-col w-full gap-2 border border-zinc-500 rounded-md p-2">
                <Text className="font-rubik-semibold text-violet-500 text-lg">
                  Input Guid
                </Text>
                {fields.map((field, index) => (
                  <CardOutputDevice
                    key={index}
                    guid={field.value}
                    index={index}
                    removeOutputDevice={remove}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                className="bg-violet-600 p-3 rounded-md"
              >
                {!loading ? (
                  <View className="flex flex-row gap-2 justify-center items-end">
                    <MaterialIcons name="rule" size={24} color="white" />
                    <Text className="font-rubik-bold text-xl text-white">
                      Submit
                    </Text>
                  </View>
                ) : (
                  <ActivityIndicator
                    animating={true}
                    color={MD2Colors.purple100}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex flex-col w-full items-center">
              <Image source={images.notfound} className="size-96" />
              <Text className="font-rubik-extrabold text-red-500 text-5xl">
                Oops!
              </Text>
              <Text className="font-rubik-medium text-black-200 text-xl text-center">
                No output device is selected yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

interface ChildProps {
  guid: string
  index: number
  removeOutputDevice: (index?: number | number[]) => void
}

const CardOutputDevice: React.FC<ChildProps> = ({
  guid,
  index,
  removeOutputDevice,
}) => {
  return (
    <View className="p-3 rounded bg-slate-200 flex flex-row justify-between items-center">
      <Text className="font-rubik-semibold text-black-300">{guid}</Text>
      <TouchableOpacity
        className="bg-red-500 rounded"
        onPress={() => removeOutputDevice(index)}
      >
        <MaterialCommunityIcons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
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
