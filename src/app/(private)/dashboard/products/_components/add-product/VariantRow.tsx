import { UseFormRegister } from "react-hook-form";
import { AddProductFormData } from "@/lib/zodSchemas/addProductSchema";
import { InputField, SelectField, LoadingSelect } from "./form-ui";

interface VariantRowProps {
  index: number;
  colors: any[];
  sizes: any[];
  errors: any;
  register: UseFormRegister<AddProductFormData>;
  remove: (index: number) => void;
  loadingSelects: boolean;
}

export const VariantRow = ({
  index,
  colors,
  sizes,
  errors,
  register,
  remove,
  loadingSelects,
}: VariantRowProps) => {
  const base = `variants.${index}` as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start bg-gray-700/50 p-4 rounded-xl border border-gray-600">
      {loadingSelects ? (
        <LoadingSelect label="Color" />
      ) : colors.length === 0 ? (
        <div className="space-y-2 w-full">
          <label className="text-white font-semibold text-sm">Color</label>
          <div className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-500 text-xs italic">
            None found
          </div>
        </div>
      ) : (
        <SelectField
          label="Color"
          options={colors.map((c) => ({ value: c.name, label: c.name }))}
          {...register(`${base}.color`)}
          error={errors?.color}
        />
      )}

      {loadingSelects ? (
        <LoadingSelect label="Size" />
      ) : sizes.length === 0 ? (
        <div className="space-y-2 w-full">
          <label className="text-white font-semibold text-sm">Size</label>
          <div className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-500 text-xs italic">
            None found
          </div>
        </div>
      ) : (
        <SelectField
          label="Size"
          options={sizes.map((s) => ({ value: s.name, label: s.name }))}
          {...register(`${base}.size`)}
          error={errors?.size}
        />
      )}

      <InputField
        label="Count"
        type="number"
        {...register(`${base}.count`)}
        error={errors?.count}
      />
      <InputField
        label="Price"
        type="number"
        step="0.01"
        {...register(`${base}.price`)}
        error={errors?.price}
      />
      <InputField
        label="Old Price"
        type="number"
        step="0.01"
        placeholder="Optional"
        {...register(`${base}.oldPrice`)}
        error={errors?.oldPrice}
      />
      <InputField
        label="Discount %"
        type="number"
        placeholder="Optional"
        {...register(`${base}.discount`)}
        error={errors?.discount}
      />

      <div className="pt-7">
        <button
          type="button"
          onClick={() => remove(index)}
          className="w-full bg-red-500/10 text-red-500 border border-red-500/50 py-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
