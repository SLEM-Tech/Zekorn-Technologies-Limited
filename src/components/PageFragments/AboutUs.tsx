import {
	FiCreditCard,
	FiHeadphones,
	FiRotateCcw,
	FiTruck,
} from "react-icons/fi";
import { AboutUsContent } from "@utils/contents/General";
import React from "react";

const AboutUs = () => {
	const features = [
		{
			icon: <FiCreditCard className='text-3xl lg:text-4xl' />,
			title: "Secure Payment",
			description: "100% secure payment",
		},
		{
			icon: <FiRotateCcw className='text-3xl lg:text-4xl' />,
			title: "30 Days Return",
			description: "If goods have problems",
		},
		{
			icon: <FiHeadphones className='text-3xl lg:text-4xl' />,
			title: "24/7 Support",
			description: "Dedicated support",
		},
		{
			icon: <FiTruck className='text-3xl lg:text-4xl' />,
			title: "Free Delivery",
			description: "For all orders over $80",
		},
	];
	return (
		<section className='w-full bg-black py-16 lg:py-20 border-b border-white/5'>
			<div className='max-w-[1440px] mx-auto px-6 lg:px-10'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8'>
					{features.map((item, index) => (
						<div
							key={index}
							className='flex flex-col items-center text-center space-y-4 group'
						>
							{/* Icon Container */}
							<div className='text-white group-hover:text-primary-400 transition-colors duration-300'>
								{item.icon}
							</div>

							{/* Text Content */}
							<div className='space-y-1'>
								<h3 className='text-white font-bold uppercase tracking-widest text-sm lg:text-base'>
									{item.title}
								</h3>
								<p className='text-gray-500 text-xs lg:text-sm font-medium'>
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
