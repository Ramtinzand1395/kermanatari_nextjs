import Image from "next/image";
import Link from "next/link";

const categories = [
  { title: "بازی‌ها", src: "/icons/tic-tac-toe.png", href: "/products/games" },
  { title: "دسته کنسول", src: "/icons/gamepad.png", href: "/products/console-handler" },
  { title: "کنسول‌ها", src: "/icons/game.png", href: "/products/consoles" },
  { title: "اکشن فیگور", src: "/icons/action-figure.png", href: "/products/action-figures" },
  { title: "لوازم جانبی", src: "/icons/action-figure.png", href: "/products/accessories" },
  { title: "کیف", src: "/icons/school-bag.png", href: "/products/bags" },
];

const Categories = () => (
  <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 my-10 cursor-pointer">
    {categories.map(({ title, src, href }) => (
      <Link key={href} href={href}>
        <div className="drop-shadow-2xl shadow-2xl flex flex-col items-center space-y-3 p-4 hover:scale-105 transition">
          <h3>{title}</h3>
          <div className="relative w-full h-24">
            <Image alt={title} fill className="object-contain" src={src} />
          </div>
        </div>
      </Link>
    ))}
  </div>
);

export default Categories;
