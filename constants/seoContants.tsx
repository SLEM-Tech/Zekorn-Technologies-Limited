import { CompanyName, CompanyShortName } from "@constants";
import { Metadata } from "next";

// 1. Core Configuration Constants
export const SITE_NAME = CompanyName;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ""; // Update with actual URL
export const TWITTER_HANDLE = "";

interface SEOConfig {
	title: string;
	description: string;
	keywords: string[];
	url?: string;
	ogImage?: string;
	noIndex?: boolean;
}
// 2. The SEO Database
export const SEODATA: Record<string, SEOConfig> = {
	default: {
		title: `${SITE_NAME} | Premium Gadgets & Electronics Store`,
		description: `${CompanyShortName} is your go-to destination for the latest gadgets, smartphones, laptops, smart wearables, and electronics. Shop top brands at the best prices in Nigeria.`,
		keywords: [
			`${CompanyShortName} gadgets`,
			"Buy electronics Nigeria",
			"Smartphones online Nigeria",
			"Laptops and computers",
			"Smart wearables",
			"Tech accessories",
		],
		url: SITE_URL,
		ogImage: `${SITE_URL}/og-main.png`, // Recommended: 1200x630px image
	},
	home: {
		title: `${SITE_NAME} | Shop the Latest Gadgets & Tech`,
		description: `Discover the newest smartphones, laptops, tablets, headphones, and smart home devices at ${CompanyShortName}. Fast delivery, secure payment, and unbeatable gadget deals.`,
		keywords: [
			"Buy smartphones Nigeria",
			"Laptop deals online",
			"Gaming gadgets",
			"Smart home devices",
			"Audio and headphones",
			"Best gadget store Nigeria",
		],
		url: SITE_URL,
	},
	services: {
		title: `Gadget Categories | ${SITE_NAME}`,
		description:
			"Browse our wide range of gadget categories — phones, tablets, laptops, cameras, gaming, smart wearables, audio, and more.",
		keywords: [
			"Phone and tablets store",
			"Laptop store Nigeria",
			"Camera and photography",
			"Gaming accessories",
			"Smart wearables Nigeria",
		],
	},
	portfolio: {
		title: `Top Deals | Best Gadget Offers at ${SITE_NAME}`,
		description:
			"Explore our best gadget deals and featured products. Save big on top-brand electronics and tech accessories.",
		keywords: [
			"Gadget deals Nigeria",
			"Electronics discounts",
			"Tech sale Nigeria",
			"Best price smartphones",
		],
	},
	consultation: {
		title: `Contact Us | ${SITE_NAME}`,
		description:
			"Have questions about a product? Reach out to the ${CompanyShortName} team for expert gadget advice and purchase support.",
		keywords: [
			"Gadget support Nigeria",
			"Electronics customer service",
			"Buy gadgets online",
			"Tech help Nigeria",
		],
	},
	login: {
		title: `Login | ${SITE_NAME}`,
		description: `Sign in to your ${CompanyShortName} account to track orders, manage your wishlist, and access exclusive gadget deals.`,
		keywords: [
			"Login gadget store",
			"My orders",
			`${CompanyShortName} account`,
		],
	},
	register: {
		title: `Create Account | Join ${SITE_NAME}`,
		description: `Register at ${CompanyShortName} to enjoy fast checkout, order tracking, and exclusive member deals on top electronics and gadgets.`,
		keywords: [
			`Sign up ${CompanyShortName}`,
			"New account electronics store",
			"Shop gadgets Nigeria",
		],
	},
	user_dashboard: {
		title: `My Dashboard | ${SITE_NAME}`,
		description:
			"Manage your orders, track deliveries, and update your account details on your personal dashboard.",
		keywords: [
			"Order tracking",
			"My gadget orders",
			"Account dashboard",
		],
		noIndex: true,
	},
};

/**
 * Helper to generate Next.js Metadata objects
 */
export function constructMetadata(
	pageKey: keyof typeof SEODATA = "default",
): Metadata {
	const config = SEODATA[pageKey] || SEODATA.default;

	// Merge page-specific keywords with default brand keywords
	const allKeywords = Array.from(
		new Set([...config.keywords, ...SEODATA.default.keywords]),
	);

	return {
		title: config.title,
		description: config.description,
		keywords: allKeywords.join(", "),
		openGraph: {
			title: config.title,
			description: config.description,
			url: config.url || SITE_URL,
			siteName: SITE_NAME,
			images: [{ url: config.ogImage || SEODATA.default.ogImage! }],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: config.title,
			description: config.description,
			creator: TWITTER_HANDLE,
			images: [config.ogImage || SEODATA.default.ogImage!],
		},
		robots: config.noIndex ? "noindex, nofollow" : "index, follow",
		alternates: {
			canonical: config.url || SITE_URL,
		},
	};
}
