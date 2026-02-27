import { InputField } from "./form-ui";

export const ImageUploader = ({ register, previews, error }: any) => (
  <div className="space-y-4">
    <InputField
      label="Product Images"
      type="file"
      multiple
      accept="image/*"
      {...register("images")}
      error={error}
    />
    {previews.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {previews.map((src: string, i: number) => (
          <img
            key={i}
            src={src}
            className="w-20 h-20 object-cover rounded-lg border border-gray-500"
            alt="preview"
          />
        ))}
      </div>
    )}
  </div>
);
