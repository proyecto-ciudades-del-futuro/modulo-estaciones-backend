import {
  ConfigurationForUpdate,
  ConfigurationInput,
  ConfigurationOutputForGet,
  ConfigurationUpdate
} from "../../types/Configuration";

export function restructureForGetRequest(input: ConfigurationInput) : ConfigurationOutputForGet{
  return {
    id: input.id,
    bad: input.bad.value,
    regular: input.regular.value,
    good: input.good.value,
    noData: input.noData.value,
  };
}


export function restructureForPatchRequest(input: ConfigurationUpdate): ConfigurationForUpdate {
  let output: ConfigurationForUpdate = {};

  if (input.bad !== undefined) {
    output.bad = {
      value: input.bad,
      metadata: {}
    };
  }

  if (input.regular !== undefined) {
    output.regular = {
      value: input.regular,
      metadata: {}
    };
  }

  if (input.good !== undefined) {
    output.good = {
      value: input.good,
      metadata: {}
    };
  }

  if (input.noData !== undefined) {
    output.noData = {
      value: input.noData,
      metadata: {}
    };
  }

  return output;

}