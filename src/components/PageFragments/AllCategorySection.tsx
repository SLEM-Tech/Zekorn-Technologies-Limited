"use client";
import React, { useEffect, useRef, useState } from "react";

import Picture from "../picture/Picture";
import { useCategories, WooCommerce } from "../lib/woocommerce";
import ProductCard from "../Cards/ProductCard";
import HomeCard from "../Cards/HomeCard";
import Carousel from "../Reusables/Carousel";
import Link from "next/link";
import { convertToSlug, convertToSlug2 } from "@constants";
import { useEncryptionHelper } from "../EncryptedData";
import { useDispatch } from "react-redux";
import { updateCategorySlugId } from "../config/features/subCategoryId";
import { useRouter } from "next/navigation";
import { heroBg, heroImage, heroImage2, heroImage3 } from "@public/images";
import { Rubik } from "next/font/google";
import HeroCarousel from "../Cards/HeroCarousel";
import AboutUs from "./AboutUs";
import StatsSection from "./StatsSection";
import WhyChooseUs from "./WhyChooseUs";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi"; // Added Arrow for CTA consistency

const rubik = Rubik({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const AllCategorySection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [maxScrollTotal, setMaxScrollTotal] = useState(0);
  const [scrollLeftTotal, setScrollLeftTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // State to hold products by category
  const [categoryProductsMap, setCategoryProductsMap] = useState<{
    [key: string]: ProductType[];
  }>({});
  // WooCommerce API Category
  const {
    data: categories,
    isLoading: categoryWpIsLoading,
    isError: categoryIsError,
  } = useCategories("");

  const Categories: CategoryType[] = categories;
  const TotalCatgory = Categories?.length - 1;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);

        const filteredCategories = categories
          ?.filter((category: CategoryType) => category?.count > 0)
          ?.slice(0, 5);

        if (filteredCategories) {
          const productsPromises = filteredCategories.map(
            async (category: CategoryType) => {
              const response = await WooCommerce.get(
                `products?category=${category?.id}`,
              );

              // Check if there is at least one product in the category
              const firstProductImage =
                response?.data.length > 0
                  ? response?.data[0]?.images[0]?.src
                  : null;

              return {
                categoryId: category?.id,
                firstProductImage: firstProductImage,
              };
            },
          );

          const productsResults = await Promise.all(productsPromises);

          // Update the state with the first product images mapped by category
          const productsMap = productsResults.reduce(
            (acc: any, result: any) => ({
              ...acc,
              [result.categoryId]: result.firstProductImage,
            }),
            {},
          );

          setCategoryProductsMap(productsMap);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categories?.length) {
      fetchCategoryProducts();
    }
  }, [categories]);

  const handleNext = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);

      sliderRef.current.scrollLeft += 600;
      setCurrentIndex((prevIndex) =>
        prevIndex < TotalCatgory - 1 ? prevIndex + 1 : prevIndex,
      );
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);
      if (scrollLeft > 0) {
        sliderRef.current.scrollLeft -= 600;
        setCurrentIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      }
    }
  };

  return (
    <>
      {/* Updated Hero Section to match Screenshot exactly */}
      <section className="relative w-full h-[600px] lg:h-[750px] flex flex-col items-center justify-center text-center bg-[#111111] overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0 h-[600px] w-auto">
          <Picture
            src={heroBg}
            alt="Background"
            className="w-full h-screen object-contain opacity-60"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" /> */}
        </div>

        {/* Decorative Circles (Matches the right-side graphics in screenshot) */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[150px] h-[150px] lg:w-[240px] lg:h-[240px] opacity-30 pointer-events-none hidden md:block z-10">
          <div className="absolute inset-0 border-[1.5px] border-primary rounded-full" />
          <div className="absolute inset-0 border-[1.5px] border-blue-500 rounded-full translate-x-12 translate-y-12" />
        </div>

        {/* Main Content Container */}
        <div className="relative z-20 flex flex-col items-center max-w-4xl px-6 space-y-6">
          <div className="space-y-1 lg:space-y-2">
            <h1 className="text-2xl lg:text-6xl text-white tracking-tight leading-tight lg:whitespace-nowrap">
              Your Ultimate Gadget Destination
            </h1>
            <h1 className="text-2xl lg:text-6xl text-primary leading-tight">
              Shop the Latest Tech!
            </h1>
          </div>

          <p className="text-gray-400 text-xs lg:sm font-light tracking-wide max-w-xl">
            From smartphones to laptops, smart wearables to accessories — discover premium gadgets at unbeatable prices.
          </p>

          {/* CTA BUTTON - Redesigned to match "Start Now" button */}
          <button
            onClick={() => router.push("/category")}
            className="group flex items-center gap-2 bg-primary hover:bg-opacity-90 text-white text-sm md:text-base px-8 py-3.5 rounded-xl font-medium transition-all active:scale-95 shadow-xl shadow-black/20 mt-4"
          >
            Shop Now  
            <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* <AboutUs /> */}
      {/* <StatsSection /> */}
    </>
  );
};

export default AllCategorySection;
