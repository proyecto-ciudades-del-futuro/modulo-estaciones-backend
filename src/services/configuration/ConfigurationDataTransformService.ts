import {
  ConfigurationForUpdate,
  ConfigurationInput,
  ConfigurationOutputForGet,
  ConfigurationUpdate
} from "../../types/Configuration";

export function restructureForGetRequest(input: ConfigurationInput) : ConfigurationOutputForGet{
  return {
    id: input.id,
    Bad: input.Bad.value,
    Regular: input.Regular.value,
    Good: input.Good.value,
    NoData: input.NoData.value,
  };
}


export function restructureForPatchRequest(input: ConfigurationUpdate): ConfigurationForUpdate {
  let output: ConfigurationForUpdate = {};

  if (input.Bad !== undefined) {
    output.Bad = {
      value: input.Bad,
      metadata: {}
    };
  }

  if (input.Regular !== undefined) {
    output.Regular = {
      value: input.Regular,
      metadata: {}
    };
  }

  if (input.Good !== undefined) {
    output.Good = {
      value: input.Good,
      metadata: {}
    };
  }

  if (input.NoData !== undefined) {
    output.NoData = {
      value: input.NoData,
      metadata: {}
    };
  }

  return output;

}