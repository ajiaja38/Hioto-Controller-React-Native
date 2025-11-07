import { EDevice, EDeviceStatus } from "../enum/EDevice.enum"

export interface IRegisterDevicePayload {
  guid: string
  mac: string
  type: string
  quantity: string
  name: string
  version: string
  minor: string
}

export interface IRegisterDeviceDto {
  guid: string
  mac: string
  type: EDevice
  quantity: number
  name: string
  version: string
  minor: string
}

export interface IResponseDevice extends IRegisterDeviceDto {
  id: number
  status: string
  status_device: EDeviceStatus
  created_at: string
  updated_at: string
}

export interface IControlDevice {
  type: EDevice
  message: string
}
