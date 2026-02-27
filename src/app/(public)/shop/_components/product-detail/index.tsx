"use client";

import { Toaster } from "react-hot-toast";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import Card from "@/components/Card";
import { Product, RelatedProduct } from "./types";
import { useProductLogic } from "./useProductLogic";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

interface ProductDetailViewProps {
  session: any;
  initialProduct: Product;
  initialRelatedProducts: RelatedProduct[];
}

const ProductDetailView = ({
  session,
  initialProduct,
  initialRelatedProducts,
}: ProductDetailViewProps) => {
  const { state, actions } = useProductLogic({
    product: initialProduct,
    session,
  });

  return (
    <>
      <Toaster />
      <BreadCrumbGlobal />

      <div className="bg-white text-gray-800 max-w-screen overflow-x-hidden">
        <section className="px-6 md:px-16 py-10 grid md:grid-cols-2 gap-10">
          <ProductGallery
            images={state.images}
            productName={initialProduct.name}
            activeImage={state.activeImage}
            onImageSelect={actions.setActiveImage}
          />

          <ProductInfo
            product={initialProduct}
            state={state}
            actions={actions}
          />
        </section>

        <section className="px-6 md:px-16 mt-12">
          <div className="flex border-b">
            <button
              onClick={() => actions.setActiveTab("details")}
              className={`py-3 px-6 font-medium border-b-2 transition-colors ${
                state.activeTab === "details"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              Product Details
            </button>
          </div>
          <div className="py-8 text-gray-700 leading-relaxed whitespace-pre-line max-w-4xl">
            {state.activeTab === "details" &&
              (initialProduct.details ||
                initialProduct.description ||
                "No specific details available.")}
          </div>
        </section>

        <section className="px-6 md:px-16 py-16 bg-gray-50/50">
          <h3 className="text-2xl font-bold mb-8 text-center md:text-left">
            You Might Also Like
          </h3>

          {initialRelatedProducts.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              No related products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {initialRelatedProducts.map((item) => {
                const totalStock =
                  item.variants?.reduce(
                    (acc, v) => acc + (Number(v.count) || 0),
                    0,
                  ) ?? 0;

                const isOutOfStock = totalStock <= 0;

                const displayVariant = [...item.variants].sort((a, b) => {
                  const aInStock = (a.count ?? 0) > 0;
                  const bInStock = (b.count ?? 0) > 0;
                  if (aInStock !== bInStock) return aInStock ? -1 : 1;
                  return (a.price ?? 0) - (b.price ?? 0);
                })[0];

                return (
                  <Card
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={displayVariant?.price ?? 0}
                    oldPrice={displayVariant?.oldPrice ?? null}
                    discount={displayVariant?.discount ?? null}
                    image={item.images?.[0]?.url}
                    href={`/shop/${item.id}`}
                    isOutOfStock={isOutOfStock}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProductDetailView;
