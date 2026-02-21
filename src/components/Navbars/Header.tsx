"use client";
import React, {
  useMemo,
  useState,
  useTransition,
  Fragment,
  useRef,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "react-use-cart";
import { useAppDispatch, useAppSelector } from "../hooks";
import Drawer from "rc-drawer";
import { useCustomer } from "../lib/woocommerce";
import {
  currencyOptions,
  filterCustomersByEmail,
  headerNavLinks,
} from "@constants";
import { getFirstCharacter, signOut } from "@utils/lib";
import { LogoImage } from "@utils/function";
import Picture from "../picture/Picture";
import { APICall } from "@utils";
import { fetchExchangeRate } from "@utils/endpoints";
import { setBaseCurrency, setExchangeRate } from "../Redux/Currency";
import FormToast from "../Reusables/Toast/SigninToast";
import useToken from "../hooks/useToken";

// Headless UI Components
import { Menu, Transition } from "@headlessui/react";
import {
  FiSearch,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import { SlArrowDown } from "react-icons/sl";
import Flag from "react-world-flags";
import GlobalLoader from "../modal/GlobalLoader";
import MobileNav from "./MobileNav";
import ProductTable from "../Tables/ProductTable";
import CategoryPageBottomHeader from "./CategoryPageBottomHeader";
import ProductPageBottomHeader from "./ProductPageBottomHeader";
import HomePageBottomHeader from "./HomePageBottomHeader";
import { FaCartArrowDown, FaShoppingBag } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
import Link from "@node_modules/next/link";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { email } = useToken();
  const { totalItems } = useCart();

  const { baseCurrency } = useAppSelector((state) => state.currency);
  const [isPending, startTransition] = useTransition();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [isSearchExpanded, setIsSearchExpanded] = useState(true); // Default to design's static look
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: customer } = useCustomer("");
  const wc_customer_info = useMemo(
    () => filterCustomersByEmail(customer as Woo_Customer_Type[], email),
    [customer, email],
  );

  useEffect(() => {
    if (isSearchExpanded && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchExpanded]);

  const onOpenCart = () => setIsCartOpen(true);
  const onCloseCart = () => setIsCartOpen(false);

  const handleCurrencyChange = async (code: string) => {
    const selectedObj = currencyOptions.find((c) => c.code === code);
    if (!selectedObj) return;

    try {
      const data = await APICall(fetchExchangeRate, ["NGN", code], true, true);
      if (data) {
        dispatch(setExchangeRate(data));
        dispatch(setBaseCurrency(selectedObj));
        FormToast({ message: `Switched to ${code}`, success: true });
      }
    } catch (error) {
      FormToast({ message: "Currency switch failed", success: false });
    }
  };

  const handleSearch = () => {
    if (!searchValue) return;
    startTransition(() => {
      router.push(`/search?q=${searchValue}`);
    });
  };

  const userDropDownLinks = [
    { id: 1, href: "/user/dashboard", icon: <BiUser />, label: "My Account" },
    {
      id: 2,
      href: "/user/my-orders",
      icon: <FaCartArrowDown />,
      label: "Orders",
    },
    { id: 3, onClick: onOpenCart, icon: <FiShoppingCart />, label: "Cart" },
  ];

  return (
    <>
      <header className="flex flex-col w-full bg-[#F9F9F9] z-[100] fixed top-0 border-b border-gray-100 transition-all duration-300">
        {/* Main Desktop Header */}
        <div className="hidden slg:flex items-center justify-between w-full py-5 max-w-[1540px] px-12 mx-auto gap-8">
          {/* 1. Logo Section */}
          <div className="flex items-center shrink-0">
            {/* <Link
              href="/"
              className="text-xl font-black uppercase tracking-tight text-gray-900"
            >
              LOGO
            </Link> */}
          </div>

          {/* 2. Navigation & Search Container */}
          <div className="flex items-center gap-10 flex-1 justify-end">
            <nav className="flex gap-10">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors hover:text-black ${
                    pathname === link.href ? "text-black" : "text-gray-500"
                  }`}
                >
                  {link.text}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Styled to match screenshot pill shape */}
            <div className="relative flex items-center w-full max-w-[180px]">
              <div className="flex items-center w-full rounded-full border border-gray-300 bg-white px-4 py-1.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {isPending && (
                  <ImSpinner2 className="text-gray-400 animate-spin size-3 shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* 3. Controls (Cart & Shop Button) */}
          <div className="flex items-center gap-8 shrink-0">
            {/* Cart Section Styled to Design */}
            <div
              className="flex items-center gap-2 cursor-pointer group relative"
              onClick={onOpenCart}
            >
              <div className="relative">
                <FiShoppingCart
                  size={24}
                  className="text-gray-700 group-hover:text-primary transition-colors"
                />
                <span className="absolute -top-1.5 -right-2 size-5 bg-[#29C482] text-white text-[11px] font-bold flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </div>
              <span className="text-gray-500 text-sm font-medium mt-1">
                Cart
              </span>
            </div>

            {/* CTA Button styled as "Shop Now" */}
            <Link
              href="/category"
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm"
            >
              Shop Now
            </Link>

            {/* User Profile (Maintained logic, but styled discretely) */}
            <Menu as="div" className="relative ml-2">
              <Menu.Button className="flex items-center outline-none">
                <div className="size-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs border border-gray-300 overflow-hidden">
                  {wc_customer_info?.shipping?.address_2 ? (
                    <Picture
                      src={wc_customer_info.shipping.address_2}
                      alt="user"
                      className="size-full object-cover"
                    />
                  ) : (
                    getFirstCharacter(wc_customer_info?.first_name || "U")
                  )}
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
              >
                <Menu.Items className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[110] outline-none">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-black">
                      {wc_customer_info?.first_name || "Guest User"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {userDropDownLinks.map((item) => (
                      <Menu.Item key={item.id}>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              if (item.onClick) {
                                e.preventDefault();
                                item.onClick();
                              } else if (item.href) {
                                router.push(item.href);
                              }
                            }}
                            className={`${active ? "bg-gray-50 text-primary" : "text-gray-600"} flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all`}
                          >
                            {item.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                  <Menu.Item>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg mt-1 transition-all"
                    >
                      Log Out
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="slg:hidden flex flex-col w-full p-5 gap-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerVisible(true)}
                className="p-2 rounded-lg bg-gray-50 border border-gray-200"
              >
                <FiMenu className="text-xl text-black" />
              </button>
              <span className="text-lg font-black tracking-tight">LOGO</span>
            </div>
            <div
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-primary"
            >
              <FiShoppingCart className="text-xl text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 size-5 bg-[#29C482] border-2 border-white rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 text-sm bg-gray-50 text-black rounded-full px-5 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Conditional Bottom Headers */}
        <div className="bg-white border-t border-gray-100">
          {pathname.includes("/category") ? (
            <CategoryPageBottomHeader />
          ) : pathname.includes("/home-item") ? (
            <ProductPageBottomHeader />
          ) : null}
        </div>
      </header>

      {/* Cart Drawer */}
      <Drawer
        open={isCartOpen}
        onClose={onCloseCart}
        placement="right"
        width={
          typeof window !== "undefined" && window.innerWidth > 768
            ? 500
            : "100%"
        }
        className="bg-white shadow-2xl"
      >
        <ProductTable onClose={onCloseCart} />
      </Drawer>

      <GlobalLoader isPending={isPending} />
      <MobileNav
        closeDrawer={() => setDrawerVisible(false)}
        drawerVisible={drawerVisible}
      />
    </>
  );
};

export default Header;
