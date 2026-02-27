"use client";

import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  memo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery("");
      setShowSearch(false);
    },
    [query, router],
  );

  useEffect(() => {
    if (!showSearch) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  return (
    <div ref={searchRef} className="relative flex items-center">
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center relative"
      >
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-40 lg:w-64 pl-3 pr-10 py-2 rounded-md border border-gray-300
                              focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400
                              transition-all duration-300 text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2
                              p-1.5 rounded-md bg-gray-100 hover:bg-gray-200
                              active:scale-95 transition flex items-center justify-center"
        >
          <Search className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </button>
      </form>

      <button
        className="md:hidden p-1 rounded-md hover:bg-gray-100 transition"
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <Search className="w-6 h-6 text-gray-800 cursor-pointer" />
      </button>

      {showSearch && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 md:hidden z-50 border border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-300
                                       focus:outline-none focus:ring-2 focus:ring-gray-300
                                       focus:border-gray-400 text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2
                                      p-1.5 rounded-md bg-gray-100 hover:bg-gray-200
                                      active:scale-95 transition flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-gray-600 hover:text-gray-800" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default memo(SearchBar);
