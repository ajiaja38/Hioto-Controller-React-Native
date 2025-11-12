import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"
import { HelperText, TextInput } from "react-native-paper"

interface ControlTextProps<T extends FieldValues> {
  name: Path<T>
  label: string
  defaultValue?: PathValue<T, Path<T>> | undefined
  control: Control<T>
  errors: FieldErrors<T>
}

const ControlText = <T extends FieldValues>({
  name,
  label,
  defaultValue,
  control,
  errors,
}: ControlTextProps<T>): JSX.Element => {
  const errorMessage = errors[name]?.message?.toString()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <TextInput
            mode='outlined'
            label={label}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!errorMessage}
          />
          {errorMessage && (
            <HelperText type='error' visible={!!errorMessage}>
              {errorMessage}
            </HelperText>
          )}
        </>
      )}
    />
  )
}

export default ControlText
