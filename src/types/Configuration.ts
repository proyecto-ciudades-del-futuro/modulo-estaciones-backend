export interface ConfigurationInput {
  id: string;
  type: string;
  bad: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
  good: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
  noData: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
  regular: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
}


export interface ConfigurationOutputForGet {
  id: string;
  bad: number;
  regular: number;
  good: number;
  noData: number;
}


export type ConfigurationUpdate = Partial<ConfigurationOutputForGet>;


interface PartialConfigurationValue {
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface ConfigurationForUpdate {
  id?: string;
  bad?: PartialConfigurationValue;
  good?: PartialConfigurationValue;
  noData?: PartialConfigurationValue;
  regular?: PartialConfigurationValue;
}