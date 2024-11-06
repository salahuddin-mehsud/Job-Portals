'use client'

import Cart from "@/components/front-end/Cart";
import Feature from "@/components/front-end/Featured";
import Hero from "@/components/front-end/Hero";
import Navbar from "@/components/front-end/Navbar";
import TrendingProducts from "@/components/front-end/TrendingProducts";
import { useState } from "react";



export default function Home() {

  const [showCart, setShowCart] = useState(false)
  

  return (
    <main className="pb-20">
    <Navbar setShowCart={setShowCart} />
    {showCart && <Cart setShowCart={setShowCart} />}
    <Hero/>
    <Feature/>
    <TrendingProducts/>
    </main>
  );
}
