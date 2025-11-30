import { CustomerOrder, GameListItem } from "@/types";
import { useState, useEffect, useMemo } from "react";

interface GameDropdownProps {
  userOrder: CustomerOrder | null;
  setUserOrder: React.Dispatch<React.SetStateAction<CustomerOrder | null>>;
}

export default function GameDropdownEdite({
  userOrder,
  setUserOrder,
}: GameDropdownProps) {
  const [search, setSearch] = useState("");
  const [GameData, setGameData] = useState<GameListItem[]>([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      setloading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(
          `${baseUrl}/api/admin/gamelists?platform=${userOrder?.consoleType}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("خطا در دریافت بازی‌ها");
        const data = await res.json();
        // data را به فرمتی که GameData می‌خواهد تبدیل می‌کنیم
        setGameData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setloading(false);
      }
    };

    if (userOrder?.consoleType) fetchGames();
  }, [userOrder?.consoleType]);

  // Ensure items is always an array before calling filter

  const filteredGames = useMemo(() => {
    return GameData?.filter((game) =>
      game.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, GameData]);

  return (
    <div className="relative max-w-52">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`جستجو ${userOrder?.consoleType}`}
        className="w-full p-2 border rounded-xl mt-1"
      />
      {loading
        ? "بارگزاری"
        : search &&
          filteredGames?.length > 0 && (
            <div className="mt-2 space-y-1 absolute top-12 left-0 bg-white border shadow-md z-10 w-full max-h-60 overflow-auto">
              {filteredGames?.map((game, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setUserOrder((prevOrder) => {
                      if (!prevOrder) return prevOrder;
                      {
                        return {
                          ...prevOrder,
                          list: [...(prevOrder?.list ?? []), game.name],
                        };
                      }
                      return prevOrder;
                    });
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
