import { useCallback } from "react";
import { blo } from "blo";
import { useDebounceValue } from "usehooks-ts";
import { CommonInputProps, InputBase } from "~~/components/scaffold-stark";
import { Address } from "@starknet-react/chains";
import { isAddress } from "~~/utils/scaffold-stark/common";
import Image from "next/image";

/**
 * Address input with ENS name resolution
 */
export const AddressInput = ({
  value,
  name,
  placeholder,
  onChange,
  disabled,
}: CommonInputProps<Address | string>) => {
  // TODO : Add Starkname functionality here with cached profile, check ENS on scaffold-stark
  const [_debouncedValue] = useDebounceValue(value, 500);

  const handleChange = useCallback(
    (newValue: Address) => {
      // ---- INICIO DE LA CORRECCIÓN ----
      if (typeof newValue !== "string") {
        // Si inputValue es undefined, null, o cualquier cosa que no sea un string,
        // pasarlo tal cual o manejarlo (ej. convertir a string vacío).
        // Si onChange espera un string o undefined, esto está bien:
        onChange(newValue as Address);
        return;
      }
      // Ahora sabemos que inputValue es un string.
      const sanitizedValue = newValue.toLowerCase();

      if (sanitizedValue === "0x") {
        onChange("0x0" as Address);
        return;
      }

      const isValid = /^0x[a-f0-9]{1,64}$/.test(sanitizedValue);
      if (!isValid) {
        return;
      }

      onChange(newValue);
    },
    [onChange],
  );

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      value={value as Address}
      onChange={handleChange}
      disabled={disabled}
      prefix={null}
      suffix={
        // eslint-disable-next-line @next/next/no-img-element
        value && (
          <Image
            alt=""
            className="!rounded-full"
            src={blo(value as `0x${string}`)}
            width="35"
            height="35"
          />
        )
      }
    />
  );
};
