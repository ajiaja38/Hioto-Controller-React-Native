import {
  IControlDevice,
  IRegisterDeviceDto,
  IResponseDevice,
} from "@/types/interface/IDevice.interface"
import {
  IResponseEntity,
  IResponseMessageEntity,
} from "@/types/interface/IResponseWrapper.interface"
import { api } from "."
import { EDevice } from "@/types/enum/EDevice.enum"

export class DeviceService {
  public static async registerDevice(
    registerDeviceDto: IRegisterDeviceDto
  ): Promise<IResponseEntity<IResponseDevice>> {
    return await api.post("device", registerDeviceDto)
  }

  public static async getAllDevice(
    type: EDevice
  ): Promise<IResponseEntity<IResponseDevice[]>> {
    return await api.get("devices", {
      params: {
        type,
      },
    })
  }

  public static async getDeviceByGuid(
    guid: string
  ): Promise<IResponseEntity<IResponseDevice>> {
    return await api.get(`device/${guid}`)
  }

  public static async controlDevice(
    payload: IControlDevice
  ): Promise<IResponseMessageEntity> {
    return await api.put("device/control", payload)
  }

  public static async deleteDeviceByGuid(
    guid: string
  ): Promise<IResponseEntity<IResponseDevice>> {
    return await api.delete(`device/${guid}`)
  }
}
