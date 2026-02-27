import { Product } from "./types";
import { getColorHex } from "./utils";

interface ProductInfoProps {
  product: Product;
  state: any;
  actions: any;
}

export const ProductInfo = ({ product, state, actions }: ProductInfoProps) => {
  const {
    selectedVariant,
    selectedColor,
    selectedSize,
    allPossibleColors,
    allPossibleSizes,
    quantity,
    isAddingToCart,
    hasAnyStock,
  } = state;

  const currentPrice = selectedVariant?.price ?? product._meta.lowest;

  const currentOldPrice = selectedVariant
    ? selectedVariant.oldPrice
    : product._meta.lowestVariant?.oldPrice;

  const hasRealDiscount =
    currentOldPrice !== null &&
    currentOldPrice > 0 &&
    currentOldPrice > currentPrice;

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-3xl font-bold text-black">
            ${currentPrice.toFixed(2)}
          </span>

          {hasRealDiscount && (
            <span className="text-xl text-gray-400 line-through">
              ${Number(currentOldPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3">
          Color:{" "}
          <span className="font-normal text-gray-500">
            {selectedColor || "Select"}
          </span>
        </h3>
        <div className="flex gap-3">
          {allPossibleColors.map((color: string) => {
            const isColorDisabled = product.variants
              .filter((v) => v.color?.name === color)
              .every((v) => v.count <= 0);

            return (
              <button
                key={color}
                disabled={isColorDisabled}
                onClick={() => actions.handleSelectColor(color)}
                className={`relative w-12 h-12 rounded-full border-2 transition-all ring-offset-2 overflow-hidden ${
                  selectedColor === color
                    ? "border-black ring-2 ring-black scale-110"
                    : "border-gray-200"
                } ${
                  isColorDisabled ? "cursor-not-allowed" : "hover:scale-110"
                }`}
                style={{ backgroundColor: getColorHex(color) }}
              >
                {isColorDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[150%] h-[2px] bg-white rotate-45 shadow-[0_0_2px_rgba(0,0,0,0.6)]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3">
          Size:{" "}
          <span className="font-normal text-gray-500">
            {selectedSize || "Select"}
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {allPossibleSizes.map((size: string) => {
            const variant = product.variants.find(
              (v) => v.color?.name === selectedColor && v.size?.name === size,
            );
            const isSizeDisabled = !variant || variant.count <= 0;

            return (
              <button
                key={size}
                disabled={isSizeDisabled}
                onClick={() => actions.handleSelectSize(size)}
                className={`px-6 py-3 rounded-lg border text-sm font-bold transition-all relative overflow-hidden ${
                  selectedSize === size && !isSizeDisabled
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200"
                } ${
                  isSizeDisabled
                    ? "text-gray-600 bg-gray-50 border-gray-100 cursor-not-allowed"
                    : "hover:border-black"
                }`}
              >
                <span className="relative z-10">{size}</span>
                {isSizeDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[140%] h-[1.5px] bg-gray-400 rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => actions.setQuantity(Math.max(1, quantity - 1))}
              disabled={
                isAddingToCart || !selectedVariant || selectedVariant.count <= 0
              }
              className="px-4 py-2 hover:bg-gray-100 font-bold disabled:opacity-20 transition-colors"
            >
              –
            </button>
            <span className="w-10 text-center font-bold">{quantity}</span>
            <button
              onClick={() => actions.setQuantity(quantity + 1)}
              disabled={
                isAddingToCart ||
                !selectedVariant ||
                quantity >= selectedVariant.count
              }
              className="px-4 py-2 hover:bg-gray-100 font-bold disabled:opacity-20 transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-sm font-medium text-gray-500">
            {selectedVariant &&
            selectedVariant.count > 0 &&
            selectedVariant.count <= 3
              ? `Only ${selectedVariant.count} available`
              : ""}
          </p>
        </div>

        <button
          onClick={actions.handleAddToCart}
          disabled={
            isAddingToCart || !selectedVariant || selectedVariant.count <= 0
          }
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-sm ${
            !selectedVariant || selectedVariant.count <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isAddingToCart
                ? "bg-zinc-700 text-white cursor-wait opacity-80"
                : "bg-black text-white hover:bg-zinc-800 active:scale-[0.98]"
          }`}
        >
          {isAddingToCart
            ? "ADDING..."
            : !hasAnyStock || (selectedVariant && selectedVariant.count <= 0)
              ? "SOLD OUT"
              : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};
