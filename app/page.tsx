
"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "./(components)/Hero";
import { useUser, UserButton } from "@clerk/nextjs";
import { Features } from "./(components)/Features";
import { Pricing } from "./(components)/Pricing";
import { getStripe } from "@/lib/stripe";

function useScrollY(containerRef: React.RefObject<HTMLElement>) {

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                setScrollY(containerRef.current.scrollTop);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [containerRef]);

    return scrollY;
}
export function StickyHeader({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLElement>;
}) {
    const scrollY = useScrollY(containerRef);
    const stickyNavRef = useRef<HTMLElement>(null);
    const { theme } = useTheme();
    const [active, setActive] = useState(false);

    const user = useUser();

    const navLinks = useMemo(
        () => [
            { id: 1, label: "Home", link: "/" },
            { id: 2, label: "Features", link: "#features" },
            { id: 3, label: "Pricing", link: "#pricing" },
        ],
        [],
    );

    const navLinksHome = useMemo(
        () => [
            { id: 1, label: "Home", link: "/" },
            { id: 2, label: "Generate", link: "/generate" },
            { id: 3, label: "Collections", link: "/flashcards" },
        ],
        [],
    );

    return (
        <header ref={stickyNavRef} className="sticky top-0 z-50 px-10 py-7 xl:px-0">
            <nav className="relative mx-auto flex items-center justify-between max-w-2xl">
                <div className="font-bold">
                    CardNinja
                </div>

                <ul className="sticky left-4 right-4 top-4 z-[60] hidden items-center justify-center gap-x-5 md:flex">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{
                            boxShadow:
                                scrollY >= 120
                                    ? theme === "dark"
                                        ? "0 0 0 1px rgba(255,255,255,.08), 0 1px 2px -1px rgba(255,255,255,.08), 0 2px 4px rgba(255,255,255,.04)"
                                        : "0 0 0 1px rgba(17,24,28,.08), 0 1px 2px -1px rgba(17,24,28,.08), 0 2px 4px rgba(17,24,28,.04)"
                                    : "none",
                        }}
                        transition={{
                            ease: "linear",
                            duration: 0.05,
                            delay: 0.05,
                        }}
                        className="flex h-12 w-auto items-center justify-center overflow-hidden rounded-full px-6 py-2.5 transition-all bg-background md:p-1.5 md:py-2"
                    >
                        {user.isSignedIn ? (
                            <nav className="relative h-full items-center justify-between gap-x-3.5 md:flex">
                                <ul className="flex h-full flex-col justify-center gap-6 md:flex-row md:justify-start md:gap-0 lg:gap-1">
                                    {navLinksHome.map((navItem) => (
                                        <li
                                            key={navItem.id}
                                            className="flex items-center justify-center px-[0.75rem] py-[0.375rem]"
                                        >
                                            <a href={navItem.link}>{navItem.label}</a>
                                        </li>
                                    ))}
                                    <div className="ml-8">
                                        <UserButton />
                                    </div>
                                </ul>
                            </nav>
                        ) : (
                            <nav className="relative h-full items-center justify-between gap-x-3.5 md:flex">
                                <ul className="flex h-full flex-col justify-center gap-6 md:flex-row md:justify-start md:gap-0 lg:gap-1">
                                    {navLinks.map((navItem) => (
                                        <li
                                            key={navItem.id}
                                            className="flex items-center justify-center px-[0.75rem] py-[0.375rem]"
                                        >
                                            <a href={navItem.link}>{navItem.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: scrollY >= 120 ? "auto" : 0,
                            }}
                            transition={{
                                ease: "linear",
                                duration: 0.25,
                                delay: 0.05,
                            }}
                            className="!hidden overflow-hidden rounded-full md:!block"
                        >
                            <AnimatePresence>
                                {scrollY >= 120 && (
                                    <motion.ul
                                        initial={{ x: "125%" }}
                                        animate={{ x: "0" }}
                                        exit={{
                                            x: "125%",
                                            transition: { ease: "linear", duration: 1 },
                                        }}
                                        transition={{ ease: "linear", duration: 0.3 }}
                                        className="shrink-0 whitespace-nowrap"
                                    >
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                </ul>

                <motion.div
                    className="z-[999] hidden items-center gap-x-5 md:flex"
                    animate={{
                        y: scrollY >= 120 ? -50 : 0,
                        opacity: scrollY >= 120 ? 0 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {
                        user.isSignedIn ? (null) :
                            (<div>
                                <a href="/sign-in" className="mr-4"><span className="font-bold">Sign in</span></a>
                                <a href="/sign-up"><span className="font-bold">Sign up</span></a>
                            </div>)
                    }
                </motion.div>
                <MotionConfig transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <motion.button
                        onClick={() => setActive((prev) => !prev)}
                        animate={active ? "open" : "close"}
                        className="relative flex h-8 w-8 items-center justify-center rounded-md md:hidden"
                    >
                        <motion.span
                            style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
                            className="absolute h-0.5 w-5 bg-black dark:bg-white"
                            variants={{
                                open: {
                                    rotate: ["0deg", "0deg", "45deg"],
                                    top: ["35%", "50%", "50%"],
                                },
                                close: {
                                    rotate: ["45deg", "0deg", "0deg"],
                                    top: ["50%", "50%", "35%"],
                                },
                            }}
                            transition={{ duration: 0.3 }}
                        ></motion.span>
                        <motion.span
                            style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
                            className="absolute h-0.5 w-5 bg-black dark:bg-white"
                            variants={{
                                open: {
                                    opacity: 0,
                                },
                                close: {
                                    opacity: 1,
                                },
                            }}
                        ></motion.span>
                        <motion.span
                            style={{ left: "50%", bottom: "30%", x: "-50%", y: "-50%" }}
                            className="absolute h-0.5 w-5 bg-black dark:bg-white"
                            variants={{
                                open: {
                                    rotate: ["0deg", "0deg", "-45deg"],
                                    top: ["65%", "50%", "50%"],
                                },
                                close: {
                                    rotate: ["-45deg", "0deg", "0deg"],
                                    top: ["50%", "50%", "65%"],
                                },
                            }}
                            transition={{ duration: 0.3 }}
                        ></motion.span>
                    </motion.button>
                </MotionConfig>
            </nav>
        </header>
    );
}

export default function Home() {
    const containerRef = useRef(null);

    const handleSubscribe = async () => {
        const checkoutSession = await fetch('/api/checkout-session', {
            method: 'POST'
        })
        const checkoutSessionData = await checkoutSession.json()

        if (checkoutSession.status === 500) {
            console.error(checkoutSessionData.error)
            return
        }

        const stripe = await getStripe()
        if (!stripe) {
            console.error('Stripe not loaded properly')
            return
        }

        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionData.id
        })

        if (error) {
            console.warn(error.message)
        }
    }
    return (
        <main
            ref={containerRef}
            className=" bg-gray-100 h-full w-full overflow-y-auto"
        >
            <StickyHeader containerRef={containerRef} />
            <Hero />
            <div className="flex justify-center items-center w-full px-4">
                <div className="max-w-screen-lg w-full" id="features">
                    <Features />
                </div>
            </div>
            <div id="pricing">
                <Pricing handleSubscribe={handleSubscribe} />
            </div>
            <div>
                <section
                    id="clients"
                    className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
                >
                    <div className="py-14">
                        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                            <h2 className="text-center text-2xl font-bold  text-black">
                                MEET OUR TEAM
                            </h2>
                            <h2 className="text-lg font-bold tracking-tight text-gray-600 dark:text-white">
                                Happy to deliver software solutions for you
                            </h2>

                            <div className="mt-6">
                                <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
                                    <li className="flex flex-col items-center">
                                        <img
                                            src="/images/member_jorgeandrespadilla.jpeg"
                                            alt="Jorge Andres Padilla"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                        <p className="mt-2 text-center text-sm font-medium text-black">Jorge Andres Padilla</p>
                                    </li>
                                    <li className="flex flex-col items-center">
                                        <img
                                            src="/images/member_gabrielapadilla.jpeg"
                                            alt="Gabriela Padilla"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                        <p className="mt-2 text-center text-sm font-medium text-black">Gabriela Padilla</p>
                                    </li>
                                    <li className="flex flex-col items-center">
                                        <img
                                            src="/images/member_jennifermena.jpeg"
                                            alt="Jennifer Mena"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                        <p className="mt-2 text-center text-sm font-medium text-black">Jennifer Mena</p>
                                    </li>
                                    <li className="flex flex-col items-center">
                                        <img
                                            src="/images/member_guleednuh.jpeg"
                                            alt="Guleed Nuh"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                        <p className="mt-2 text-center text-sm font-medium text-black">Guleed Nuh</p>
                                    </li>
                                </ul>
                            </div>
                            <br />
                            <br />
                        </div>
                    </div>
                </section>
            </div>


        </main>
    );
}
