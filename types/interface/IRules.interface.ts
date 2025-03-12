export interface ICreateRulesDto {
  input_guid: string;
  output_guid: string[];
}

export interface IResponseRule {
  mac_server: string;
  input_guid: string;
  input_value: string;
  output_guid: string;
  output_value: string;
  created_at: string;
  updated_at: string;
}
