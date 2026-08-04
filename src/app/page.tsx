import NavBar from "@/components/layout/NavBar";
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col bg-black">
      <NavBar />
      <Hero />
    </div>
  );
}
