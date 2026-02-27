import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  activeImage: number;
  onImageSelect: (index: number) => void;
}

export const ProductGallery = ({
  images,
  productName,
  activeImage,
  onImageSelect,
}: ProductGalleryProps) => {
  return (
    <div className="w-full">
      <div className="relative rounded-2xl shadow-md overflow-hidden mb-5 aspect-[4/5] max-w-[350px] mx-auto md:max-w-[400px]">
        <Image
          src={images[activeImage]}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex gap-3 justify-center w-full max-w-[350px] mx-auto mt-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden transition shrink-0 ${
              activeImage === index
                ? "border-black"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
