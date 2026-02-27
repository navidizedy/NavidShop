"use client";

import { memo, useState, useEffect, useRef } from "react";

function FiltersSidebar({
  categories,
  colors,
  sizes,
  selectedCategories,
  selectedColors,
  selectedSizes,
  setSelectedCategories,
  setSelectedColors,
  setSelectedSizes,
  hasFilters,
  clearAll,
}: any) {
  const [localCats, setLocalCats] = useState(selectedCategories);
  const [localColors, setLocalColors] = useState(selectedColors);
  const [localSizes, setLocalSizes] = useState(selectedSizes);
  const isToggling = useRef(false);

  useEffect(() => {
    if (!isToggling.current) {
      setLocalCats(selectedCategories);
      setLocalColors(selectedColors);
      setLocalSizes(selectedSizes);
    }
    isToggling.current = false;
  }, [selectedCategories, selectedColors, selectedSizes]);

  const toggle = (
    item: string,
    currentList: string[],
    setter: any,
    parentSetter: any,
  ) => {
    isToggling.current = true;
    const newList = currentList.includes(item)
      ? currentList.filter((i: string) => i !== item)
      : [...currentList, item];
    setter(newList);
    parentSetter(newList);
  };

  return (
    <aside className="space-y-8 bg-gray-50 p-6 rounded-2xl border shadow-sm sticky top-20">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg">Filters</h4>
        {hasFilters && (
          <button
            onClick={() => {
              isToggling.current = false;
              clearAll();
            }}
            className="text-xs text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat: any) => (
            <label
              key={cat.id}
              className="flex gap-2 cursor-pointer text-sm items-center"
            >
              <input
                type="checkbox"
                checked={localCats.includes(cat.name)}
                onChange={() =>
                  toggle(
                    cat.name,
                    localCats,
                    setLocalCats,
                    setSelectedCategories,
                  )
                }
                className="accent-black w-4 h-4 cursor-pointer"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color: any) => (
            <button
              key={color.id}
              type="button"
              onClick={() =>
                toggle(
                  color.name,
                  localColors,
                  setLocalColors,
                  setSelectedColors,
                )
              }
              className={`w-6 h-6 rounded-full border-2 transition-all ${localColors.includes(color.name) ? "border-black scale-110" : "border-gray-200"}`}
              style={{ backgroundColor: color.name.toLowerCase() }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size: any) => (
            <button
              key={size.id}
              type="button"
              onClick={() =>
                toggle(size.name, localSizes, setLocalSizes, setSelectedSizes)
              }
              className={`px-3 py-1 rounded border text-xs transition-all ${localSizes.includes(size.name) ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:border-black"}`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default memo(FiltersSidebar);
