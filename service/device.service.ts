import {
  IRegisterDeviceDto,
  IResponseDevice,
} from "@/types/interface/IDevice.interface";
import { IResponseEntity } from "@/types/interface/IResponseWrapper.interface";
import { api } from ".";

export class DeviceService {
  public static async registerDevice(
    registerDeviceDto: IRegisterDeviceDto
  ): Promise<IResponseEntity<IResponseDevice>> {
    return await api.post("/device", registerDeviceDto);
  }
}
