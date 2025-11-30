"use client"; // مهم برای React client component
import { CustomerOrder, GameListItem } from "@/types";
import { useState, useEffect, useMemo } from "react";

interface GameDropdownProps {
  Selectedgames: CustomerOrder;
  setSelectedgames: React.Dispatch<React.SetStateAction<CustomerOrder>>;
}

export default function GameDropdown({
  Selectedgames,
  setSelectedgames,
}: GameDropdownProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [GameData, setGameData] = useState<GameListItem[]>([]);

  // دریافت لیست بازی‌ها از API
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(
          `${baseUrl}/api/admin/gamelists?platform=${Selectedgames.consoleType}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("خطا در دریافت بازی‌ها");
        const data = await res.json();
        // data را به فرمتی که GameData می‌خواهد تبدیل می‌کنیم
        setGameData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (Selectedgames.consoleType) fetchGames();
  }, [Selectedgames.consoleType]);

  const filteredGames = useMemo(() => {
    return (
      GameData?.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [search, GameData]);
  console.log(Selectedgames);
  return (
    <div className="relative max-w-52">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`جستجو ${Selectedgames.consoleType}`}
        className="w-full p-2 border rounded-xl mt-1"
      />

      {loading
        ? "در حال بارگذاری"
        : GameData &&
          search &&
          filteredGames?.length > 0 && (
            <div className="mt-2 space-y-1 absolute top-12 left-0 bg-white border shadow-md z-10 w-full max-h-60 overflow-auto">
              {filteredGames?.map((game, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedgames((prevOrder) => ({
                      ...prevOrder,
                      list: [...prevOrder.list, game.name],
                    }));
                    setSearch("");
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {game.name}
                </div>
              ))}
            </div>
          )}
    </div>
  );
}
