import type { Metadata } from "next";
import Order from "@/components/sections/Order";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Commission a Project — Omnilertlab",
  description:
    "Start a project commission with Mehrshad Hamavandy. Websites, full-stack apps, AI automation, Three.js experiences, and more.",
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Order />
      </main>
      <Footer />
    </>
  );
}
