import { RefreshControl, ScrollView, View } from "react-native"
import React, { FC, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { EDevice, EStatus } from "@/types/enum/EDevice.enum"
import {
  ActivityIndicator,
  Appbar,
  Card,
  SegmentedButtons,
  Switch,
  Text,
  TouchableRipple,
} from "react-native-paper"
import { router, Router, useRouter } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DeviceService } from "@/service/device.service"
import { useToast } from "@/hooks/useToas"
import { IControlDevice } from "@/types/interface/IDevice.interface"

const Devices = () => {
  const [value, setValue] = useState<EDevice>(EDevice.SENSOR)
  const router: Router = useRouter()
  const { toasError } = useToast()

  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["devices", value],
    queryFn: () => DeviceService.getAllDevice(value).then((res) => res.data),
  })

  if (error) toasError(error.message)

  const { mutate } = useMutation({
    mutationFn: (payload: IControlDevice) =>
      DeviceService.controlDevice(payload),
    onSuccess: () => refetch(),
    onError: (error) => toasError(error.message),
  })

  const handleControlDevice = (payload: IControlDevice) => mutate(payload)

  useEffect(() => {
    refetch()
  }, [value])

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title='Devices' />
      </Appbar.Header>
      <View className='px-4 flex-1'>
        <SegmentedButtons
          value={value}
          onValueChange={setValue as any}
          buttons={[
            {
              value: EDevice.SENSOR,
              label: "Sensor",
            },
            {
              value: EDevice.AKTUATOR,
              label: "Aktuator",
            },
          ]}
        />
        {isLoading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' />
          </View>
        ) : (
          <ScrollView
            className='mt-4'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
          >
            {data?.map((device) => (
              <View key={device.guid} className='mb-4'>
                <DeviceCard
                  key={device.guid}
                  title={device.name}
                  guid={device.guid}
                  type={device.type}
                  status={device.status as EStatus}
                  callback={handleControlDevice}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  )
}

interface cardProps {
  title: string
  guid: string
  type: EDevice
  status: EStatus
  callback: (payload: IControlDevice) => void
}

const DeviceCard: FC<cardProps> = ({ title, guid, type, status, callback }) => {
  const isOn: boolean = status === EStatus.ON

  const onToggleSwitch = () => {
    callback({
      type: type,
      message: isOn ? `${guid}#0` : `${guid}#1`,
    })
  }

  return (
    <Card
      elevation={0}
      style={{
        shadowColor: "transparent",
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Card.Content>
        <Text variant='labelSmall'>{title}</Text>
      </Card.Content>
      <Card.Actions>
        <TouchableRipple
          onPress={() => {}}
          rippleColor='rgba(0, 0, 0, .2)'
          className='bg-violet-500 py-2 px-4 rounded-xl'
        >
          <Text
            variant='titleSmall'
            style={{ color: "white" }}
            onPress={() =>
              router.navigate({
                pathname: "/device/[id]",
                params: { id: guid },
              })
            }
          >
            Detail
          </Text>
        </TouchableRipple>
        {type === EDevice.AKTUATOR ? (
          <Switch value={isOn} onValueChange={onToggleSwitch} />
        ) : null}
      </Card.Actions>
    </Card>
  )
}

export default Devices
