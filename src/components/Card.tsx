import Link from "next/link";
import Image from "next/image";

interface CardProps {
  id: string | number;
  name: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  image: string;
  href: string;
  isOutOfStock?: boolean;
}

export default function Card({
  name,
  price,
  oldPrice,
  image,
  href,
  isOutOfStock = false,
}: CardProps) {
  const imageUrl = image || "/placeholder-product.png";

  const isOnSale = oldPrice !== null && oldPrice > price;

  const discountPercent = isOnSale
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  return (
    <Link
      href={href}
      className={`group block rounded-xl border border-gray-100 bg-white p-3 shadow-md transition-all duration-300 
        ${
          isOutOfStock
            ? "opacity-90 cursor-default"
            : "hover:border-gray-200 hover:shadow-lg"
        }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`object-cover transition duration-500 ${
            isOutOfStock
              ? "grayscale-[50%] contrast-75"
              : "group-hover:scale-105"
          }`}
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
            <span className="rounded bg-black/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
              Sold Out
            </span>
          </div>
        )}

        {isOnSale && (
          <span
            className={`absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg transform transition-transform duration-300 group-hover:scale-105 
            ${isOutOfStock ? "bg-gray-500" : "bg-red-600"}`}
          >
            -{discountPercent}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3
          className={`text-base font-medium line-clamp-2 transition-colors duration-200 
          ${
            isOutOfStock
              ? "text-gray-400"
              : "text-gray-800 group-hover:text-indigo-600"
          }`}
        >
          {name}
        </h3>

        <div className="mt-1 flex items-baseline space-x-2">
          <p
            className={
              isOutOfStock
                ? "text-lg font-bold text-gray-400"
                : "text-lg font-bold text-gray-900"
            }
          >
            ${Number(price || 0).toFixed(2)}
          </p>

          {isOnSale && (
            <p className="text-sm text-gray-400 line-through">
              ${oldPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
