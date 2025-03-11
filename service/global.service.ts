import { IResponseMessageEntity } from "@/types/interface/IResponseWrapper.interface";
import { api } from ".";

export class GlobalService {
  public static async initApi(): Promise<IResponseMessageEntity> {
    return await api.get("");
  }
}
