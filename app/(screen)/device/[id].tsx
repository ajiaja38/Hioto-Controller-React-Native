import { View, Text, ScrollView, StyleSheet } from "react-native"
import React, { useState, useEffect } from "react"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  Dialog,
  HelperText,
  MD2Colors,
  Modal,
  Portal,
  Switch,
  TouchableRipple,
} from "react-native-paper"
import { useToast } from "@/hooks/useToas"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DeviceService } from "@/service/device.service"
import { EDevice, EStatus } from "@/types/enum/EDevice.enum"
import {
  IControlDevice,
  IUpdateDeviceDto,
} from "@/types/interface/IDevice.interface"
import { z } from "zod"
import { updateDeviceSchema } from "@/schema/deviceSchema"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dropdown } from "react-native-element-dropdown"
import ControlText from "@/components/ControlText"

type UpdateDeviceSchema = z.infer<typeof updateDeviceSchema>

const DetailDevice = () => {
  const [optimisticStatus, setOptimisticStatus] = useState<EStatus | null>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleUpdate, setVisibleUpdate] = useState<boolean>(false)

  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { toasError, toastSuccess } = useToast()

  const queryClient = useQueryClient()

  const { data, error, refetch } = useQuery({
    queryKey: ["device", id],
    queryFn: () =>
      DeviceService.getDeviceByGuid(id! as string).then((res) => res.data),
  })

  if (error) toasError(error.message)

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: IControlDevice) =>
      DeviceService.controlDevice(payload),
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: ["devices", data?.type] })
    },
    onError: (error) => {
      setOptimisticStatus(null)
      toasError(error.message)
    },
  })

  const onToggleSwitch = () => {
    const newStatus = data?.status === EStatus.ON ? EStatus.OFF : EStatus.ON
    setOptimisticStatus(newStatus)

    mutate({
      type: data!.type,
      message: data?.status === EStatus.ON ? `${id}#0` : `${id}#1`,
    })
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDeviceSchema>({
    resolver: zodResolver(updateDeviceSchema),
  })

  const onSubmit = handleSubmit(
    async (data: UpdateDeviceSchema): Promise<void> => {
      const payload: IUpdateDeviceDto = {
        guid: data.guid,
        mac: data.mac,
        type: data.type,
        quantity: parseInt(data.quantity),
        name: data.name,
        version: data.version,
        minor: data.minor,
      }

      updateDevice(payload)
    }
  )

  const { mutate: updateDevice, isPending: isPendingUpdate } = useMutation({
    mutationFn: (payload: IUpdateDeviceDto) => {
      console.log(payload)
      return DeviceService.updateDevice(payload)
    },
    onSuccess: (res) => {
      hideDialogUpdate()
      toastSuccess(res.message)
      queryClient.invalidateQueries({ queryKey: ["devices", data?.type] })
      refetch()
    },
    onError: (error) => {
      setOptimisticStatus(null)
      hideDialogUpdate()
      toasError(error.message)
    },
  })

  const { mutate: deleteDevice } = useMutation({
    mutationFn: (guid: string) => DeviceService.deleteDeviceByGuid(guid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["devices", data?.type] })
      toastSuccess(res.message)
      router.back()
    },
    onError: (error) => {
      setOptimisticStatus(null)
      toasError(error.message)
    },
  })

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  const showDialogUpdate = () => setVisibleUpdate(true)
  const hideDialogUpdate = () => setVisibleUpdate(false)

  const currentStatus = optimisticStatus ?? data?.status

  useEffect(() => {
    if (data?.status && !isPending) setOptimisticStatus(null)
  }, [data?.status])

  if (!data) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator animating size='large' />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Appbar.Header style={{ backgroundColor: "white" }} elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title='Detail Device' />
      </Appbar.Header>
      <ScrollView className='flex-1 px-4 bg-gray-100'>
        <View className='p-8 rounded-2xl bg-white shadow-xl mt-5 flex flex-row items-center gap-3'>
          <Avatar.Icon
            size={50}
            icon='cube'
            style={{
              backgroundColor:
                data?.type === EDevice.AKTUATOR
                  ? currentStatus === EStatus.ON
                    ? "green"
                    : "red"
                  : "#8b5cf6",
            }}
          />
          <View style={{ flexShrink: 1 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              className='font-extrabold text-base text-black'
            >
              {data?.name}
            </Text>
            <View className='flex flex-row'>
              {data?.type === EDevice.AKTUATOR ? (
                <Text
                  className={`font-extrabold ${
                    currentStatus === EStatus.ON
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {currentStatus === EStatus.ON ? "ON" : "OFF"} .{" "}
                </Text>
              ) : null}
              <Text className='font-rubik-regular text-gray-500'>
                {data?.type}
              </Text>
            </View>
          </View>
          {data?.type === EDevice.AKTUATOR ? (
            <Switch
              value={currentStatus === EStatus.ON}
              onValueChange={() => onToggleSwitch()}
              disabled={isPending}
              color={currentStatus === EStatus.ON ? "green" : "red"}
            />
          ) : null}
        </View>
        <View className='p-8 rounded-2xl bg-white shadow-xl mt-5'>
          <Text className='font-extrabold text-xl text-gray-400 mb-3'>
            DETAIL
          </Text>
          <View className='flex flex-col gap-2'>
            <View>
              <Text className='text-gray-500'>Name:</Text>
              <Text className='font-extrabold text-sm'>{data?.name}</Text>
            </View>
            <View>
              <Text className='text-gray-500'>Guid:</Text>
              <Text className='font-extrabold text-sm'>{data?.guid}</Text>
            </View>
            <View>
              <Text className='text-gray-500'>Mac Address:</Text>
              <Text className='font-extrabold text-sm'>{data?.mac}</Text>
            </View>
            <View>
              <Text className='text-gray-500'>Version:</Text>
              <Text className='font-extrabold text-sm'>{data?.version}</Text>
            </View>
          </View>
        </View>
        <TouchableRipple
          onPress={() => showDialogUpdate()}
          rippleColor='rgba(0, 0, 0, .2)'
          className='mt-4 bg-violet-500 p-4 rounded-2xl flex flex-row justify-center items-center'
          style={{ boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.15)" }}
        >
          <Text className='text-white'>Update Device</Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => showDialog()}
          rippleColor='rgba(0, 0, 0, .2)'
          className='mt-2 bg-red-500 p-4 rounded-2xl flex flex-row justify-center items-center'
          style={{ boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.15)" }}
        >
          <Text className='text-white'>Delete Device</Text>
        </TouchableRipple>
      </ScrollView>
      <Portal>
        <Modal
          visible={visibleUpdate}
          onDismiss={hideDialogUpdate}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 18,
            borderRadius: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className='mt-4 flex flex-col gap-5 w-full'>
              <Text className='text-3xl font-bold mb-2'>Update Device</Text>

              <ControlText
                name='guid'
                control={control}
                defaultValue={data!.guid}
                label='Guid'
                errors={errors}
              />

              <ControlText
                name='mac'
                control={control}
                defaultValue={data!.mac}
                label='Mac Address'
                errors={errors}
              />

              <Controller
                name='type'
                defaultValue={data!.type as EDevice.SENSOR | EDevice.AKTUATOR}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Dropdown
                      style={[
                        style.dropdown,
                        { borderColor: errors.type ? "red" : "#7c3aed" },
                      ]}
                      placeholder='Select Type'
                      data={[
                        { label: "Actuator", value: EDevice.AKTUATOR },
                        { label: "Sensor", value: EDevice.SENSOR },
                      ]}
                      onChange={(item) => onChange(item.value)}
                      labelField='label'
                      valueField='value'
                      value={value}
                    />
                    {errors.type && (
                      <HelperText type='error'>
                        {errors.type?.message}
                      </HelperText>
                    )}
                  </>
                )}
              />

              <ControlText
                name='quantity'
                control={control}
                defaultValue={data!.quantity.toString()}
                label='Quantity'
                errors={errors}
              />

              <ControlText
                name='name'
                control={control}
                defaultValue={data!.name}
                label='Name'
                errors={errors}
              />

              <ControlText
                name='version'
                control={control}
                defaultValue={data!.version}
                label='Version'
                errors={errors}
              />

              <ControlText
                name='minor'
                control={control}
                defaultValue={data!.minor}
                label='Minor'
                errors={errors}
              />

              <View className='flex flex-col gap-2'>
                <Button
                  mode='contained'
                  icon={isPendingUpdate ? "" : "arrow-right"}
                  style={{
                    borderRadius: 10,
                    backgroundColor: "#7c3aed",
                  }}
                  onPress={onSubmit}
                  rippleColor='rgba(0, 0, 0, .32)'
                >
                  {!isPendingUpdate ? (
                    <Text>Update Device</Text>
                  ) : (
                    <ActivityIndicator
                      animating={true}
                      color={MD2Colors.purple100}
                    />
                  )}
                </Button>
                <Button
                  mode='contained'
                  style={{
                    borderRadius: 10,
                    backgroundColor: "red",
                  }}
                  onPress={hideDialogUpdate}
                  rippleColor='rgba(0, 0, 0, .32)'
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title>Delete Device</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this device?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>
              <Text className='text-black'>Cancel</Text>
            </Button>
            <Button onPress={() => deleteDevice(data!.guid)}>
              <Text className='text-black'>Yes</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

export default DetailDevice
