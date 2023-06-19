export interface ConfigurationInput {
  id: string;
  type: string;
  Bad: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
  Good: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
  NoData: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
  Regular: {
    type: string;
    value: number;
    metadata: Record<string, unknown>;
  };
}


export interface ConfigurationOutputForGet {
  id: string;
  Bad: number;
  Regular: number;
  Good: number;
  NoData: number;
}


export type ConfigurationUpdate = Partial<ConfigurationOutputForGet>;


interface PartialConfigurationValue {
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface ConfigurationForUpdate {
  id?: string;
  Bad?: PartialConfigurationValue;
  Good?: PartialConfigurationValue;
  NoData?: PartialConfigurationValue;
  Regular?: PartialConfigurationValue;
}