import { EDevice } from "../enum/EDevice.enum";

export interface IRegisterDevicePayload {
  guid: string;
  mac: string;
  type: string;
  quantity: string;
  name: string;
  version: string;
  minor: string;
}

export interface IRegisterDeviceDto {
  guid: string;
  mac: string;
  type: EDevice;
  quantity: number;
  name: string;
  version: string;
  minor: string;
}

export interface IResponseDevice extends IRegisterDeviceDto {
  id: number;
  created_at: string;
  updated_at: string;
}
