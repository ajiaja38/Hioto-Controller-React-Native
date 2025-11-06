import { IResponseEntity } from "@/types/interface/IResponseWrapper.interface"
import {
  ICreateRulesDto,
  IResponseRule,
} from "@/types/interface/IRules.interface"
import { api } from "."

export class RuleService {
  public static async createRule(
    createRuleDto: ICreateRulesDto
  ): Promise<IResponseEntity<IResponseRule>> {
    return await api.post("rule", createRuleDto)
  }
}
