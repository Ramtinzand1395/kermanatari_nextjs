"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddGameListModal from "./AddGameListModal";

interface GameItem {
  id: number;
  name: string;
  platform?: string;
}

type Platform = "ps5" | "ps4" | "xbox" | "copy";

interface PlatformPagination {
  items: GameItem[];
  page: number;
  totalPages: number;
}

const GameListPage = () => {
  const [loadingGameList, setLoadingGameList] = useState(false);
  const [gameLists, setGameLists] = useState<
    Record<Platform, PlatformPagination>
  >({
    ps5: { items: [], page: 1, totalPages: 1 },
    ps4: { items: [], page: 1, totalPages: 1 },
    xbox: { items: [], page: 1, totalPages: 1 },
    copy: { items: [], page: 1, totalPages: 1 },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newGame, setNewGame] = useState<{
    id: number;
    name: string;
    platform?: Platform;
  }>({
    id: 0,
    name: "",
    platform: "ps5",
  });
  const [openModal, setOpenModal] = useState(false);
  // todo
  // const [refresh, setRefresh] = useState(false);

  // دریافت لیست بازی‌ها برای یک پلتفرم با پجینیشن
  const fetchGames = async (platform: Platform) => {
    setLoadingGameList(true);
    try {
      const page = gameLists[platform].page;
      const res = await fetch(
        `/api/gamelists/update?platform=${platform}&page=${page}&limit=10`
      );
      if (!res.ok) throw new Error(`خطا در دریافت لیست ${platform}`);
      const data = await res.json();

      setGameLists((prev) => ({
        ...prev,
        [platform]: {
          items: data.items || [],
          page: data.page || 1,
          totalPages: data.totalPages || 1,
        },
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGameList(false);
    }
  };

  useEffect(() => {
    const platforms: Platform[] = ["ps5", "ps4", "xbox", "copy"];
    platforms.forEach((platform) => fetchGames(platform));
  }, []);

  const handlePageChange = (platform: Platform, newPage: number) => {
    if (newPage < 1 || newPage > gameLists[platform].totalPages) return;
    setGameLists((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], page: newPage },
    }));
    fetchGames(platform);
  };

  const updateGame = async () => {
    if (!editingId || !newGame.platform) return;

    try {
      const res = await fetch(`/api/admin/gamelistitem/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGame.name }),
      });
      if (!res.ok) throw new Error("خطا در آپدیت بازی");
      const updatedGame: GameItem = await res.json();

      setGameLists((prev) => ({
        ...prev,
        [newGame.platform!]: {
          ...prev[newGame.platform!],
          items: prev[newGame.platform!].items.map((g) =>
            g.id === updatedGame.id ? updatedGame : g
          ),
        },
      }));

      toast.success("بازی با موفقیت آپدیت شد");
    } catch (err) {
      console.error(err);
      toast.error("آپدیت بازی ناموفق بود");
    } finally {
      setEditingId(null);
    }
  };

  const deleteGame = async (platform: Platform, id: number) => {
    if (!window.confirm("آیا از حذف بازی مطمئن هستید؟")) return;

    try {
      const res = await fetch(`/api/admin/gamelistitem/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("خطا در حذف بازی");

      setGameLists((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          items: prev[platform].items.filter((g) => g.id !== id),
        },
      }));

      toast.success("بازی با موفقیت حذف شد");
    } catch (err) {
      console.error(err);
      toast.error("حذف بازی ناموفق بود");
    }
  };

  const handleEdit = (game: GameItem, platform: Platform) => {
    setEditingId(game.id);
    setNewGame({ id: game.id, name: game.name, platform });
  };

  const renderTable = (
    title: string,
    platform: Platform,
    data: PlatformPagination
  ) => (
    <div className="mb-8 overflow-x-auto">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <table className="min-w-full table-fixed text-sm font-light text-surface border border-neutral-300">
        <thead className="border-b border-neutral-200 font-medium bg-gray-100">
          <tr>
            <th className="px-4 py-2 w-2/3 wrap-break-word text-start">
              نام بازی
            </th>
            <th className="px-4 py-2 w-1/3 text-start">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-neutral-200 text-xs">
              {editingId === item.id ? (
                <td className="px-4 py-2 wrap-break-word">
                  <input
                    title="newGame"
                    type="text"
                    value={newGame.name}
                    onChange={(e) =>
                      setNewGame((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="border px-2 py-1 w-full"
                  />
                </td>
              ) : (
                <td className="px-4 py-2 wrap-break-word">{item.name}</td>
              )}
              <td className="px-4 py-2 flex items-center gap-2">
                {editingId === item.id ? (
                  <button onClick={updateGame} className="text-blue-600">
                    ذخیره
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(item, platform)}
                    className="text-blue-600"
                  >
                    ویرایش
                  </button>
                )}
                <button
                  onClick={() => deleteGame(platform, item.id)}
                  className="text-red-600"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 my-2">
        <button
          onClick={() => handlePageChange(platform, data.page - 1)}
          disabled={data.page === 1}
          className="px-4 py-1 border rounded bg-gray-200"
        >
          قبلی
        </button>
        <span>
          صفحه {data.page} از {data.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(platform, data.page + 1)}
          disabled={data.page === data.totalPages}
          className="px-4 py-1 border rounded bg-gray-200"
        >
          بعدی
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpenModal(true)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          افزودن بازی
        </button>
      </div>

      {loadingGameList ? (
        <div className="my-10 flex justify-center">درحال بارگزاری...</div>
      ) : (
        <div className="w-full md:container md:mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mx-2 my-10">
          {renderTable("پلی استیشن 5", "ps5", gameLists.ps5)}
          {renderTable("پلی استیشن 4", "ps4", gameLists.ps4)}
          {renderTable("کپی خور", "copy", gameLists.copy)}
          {renderTable("Xbox", "xbox", gameLists.xbox)}
        </div>
      )}

      {openModal && <AddGameListModal setOpenModal={setOpenModal} />}
    </div>
  );
};

export default GameListPage;
