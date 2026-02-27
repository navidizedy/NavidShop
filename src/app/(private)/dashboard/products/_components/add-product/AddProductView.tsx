"use client";

import { memo } from "react";
import { Toaster } from "react-hot-toast";
import {
  InputField,
  TextAreaField,
  SelectField,
  LoadingSelect,
} from "./form-ui";
import { useAddProductForm } from "./useAddProductForm";
import { VariantRow } from "./VariantRow";
import { ImageUploader } from "./ImageUploader";
import { FaExclamationTriangle } from "react-icons/fa";

export default memo(function AddProductView() {
  const { formMethods, variantFields, data, loading, images, onSubmit } =
    useAddProductForm();

  const {
    register,
    formState: { errors },
  } = formMethods;

  const isDataMissing =
    !loading.loadingSelects &&
    (data.categories.length === 0 ||
      data.colors.length === 0 ||
      data.sizes.length === 0);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <Toaster />
      <form
        onSubmit={onSubmit}
        className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 space-y-8"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Add New Product
        </h1>

        {isDataMissing && (
          <div className="bg-orange-500/10 border border-orange-500/50 p-4 rounded-xl flex items-center gap-3 text-orange-200">
            <FaExclamationTriangle className="text-orange-500 shrink-0" />
            <p className="text-sm">
              <span className="font-bold uppercase tracking-tight">
                Setup Required:
              </span>{" "}
              You need to create categories, colors, and sizes in the dashboard
              before you can fully list a product.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Product Name"
            placeholder="Enter name"
            {...register("name")}
            error={errors.name}
          />

          {loading.loadingSelects ? (
            <LoadingSelect label="Categories" />
          ) : data.categories.length === 0 ? (
            <div className="space-y-2 w-full">
              <label className="text-white font-semibold text-sm">
                Categories
              </label>
              <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 text-sm italic">
                No categories found.
              </div>
            </div>
          ) : (
            <SelectField
              label="Categories"
              multiple
              options={data.categories.map((c) => ({
                value: c.name,
                label: c.name,
              }))}
              {...register("categories")}
              error={errors.categories}
            />
          )}
        </div>

        <TextAreaField
          label="Description"
          placeholder="Enter description"
          {...register("description")}
          error={errors.description}
        />
        <TextAreaField
          label="Product Details"
          placeholder="Enter specs/details"
          rows={5}
          {...register("details")}
          error={errors.details}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Variants</h2>
            <button
              type="button"
              onClick={() =>
                variantFields.append({
                  color: "",
                  size: "",
                  count: 1,
                  price: 0,
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              + Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variantFields.fields.map((field, index) => (
              <VariantRow
                key={field.id}
                index={index}
                colors={data.colors}
                sizes={data.sizes}
                register={register}
                errors={errors.variants?.[index]}
                remove={variantFields.remove}
                loadingSelects={loading.loadingSelects}
              />
            ))}
            {errors.variants?.message && (
              <p className="text-red-400 text-sm">{errors.variants.message}</p>
            )}
          </div>
        </div>

        <ImageUploader
          register={register}
          previews={images.imagePreviews}
          error={errors.images}
        />

        <button
          type="submit"
          disabled={
            loading.isSubmitting || loading.loadingSelects || isDataMissing
          }
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg"
        >
          {loading.isSubmitting
            ? "Submitting..."
            : isDataMissing
              ? "Configuration Required"
              : "Submit Product"}
        </button>
      </form>
    </div>
  );
});
