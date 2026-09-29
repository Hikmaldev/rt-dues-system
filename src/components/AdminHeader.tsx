"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Users,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  X,
} from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
  kind: "household" | "bill" | "fund";
}

interface NotificationItem {
  id: string;
  household_name: string;
  house_number: string;
  period: string;
  status: "unpaid" | "partial";
}

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  paid: { text: "Lunas", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  unpaid: { text: "Belum Bayar", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  partial: { text: "Sebagian", cls: "bg-amber-50 text-amber-700 border-amber-200" },
};

const HOUSE_BADGE: Record<string, { text: string; cls: string }> = {
  tetap: { text: "Tetap", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  kontrakan: { text: "Kontrakan", cls: "bg-amber-50 text-amber-700 border-amber-200" },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Dashboard",
  subtitle = "Ringkasan",
  onOpenMobileMenu,
}) => {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifTotal, setNotifTotal] = useState(0);
  const [notifLoading, setNotifLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load tunggakan (notifikasi) saat header dimuat
  useEffect(() => {
    let cancelled = false;
    async function loadNotifications() {
      setNotifLoading(true);
      try {
        const [unpaidRes, partialRes] = await Promise.all([
          fetch("/api/bills?status=unpaid"),
          fetch("/api/bills?status=partial"),
        ]);
        const unpaidData = await unpaidRes.json();
        const partialData = await partialRes.json();
        if (cancelled) return;

        const unpaid: NotificationItem[] = unpaidData.success
          ? unpaidData.data.map((b: any) => ({ ...b, status: "unpaid" as const }))
          : [];
        const partial: NotificationItem[] = partialData.success
          ? partialData.data.map((b: any) => ({ ...b, status: "partial" as const }))
          : [];

        setNotifTotal(unpaid.length + partial.length);
        setNotifications([...unpaid, ...partial].slice(0, 5));
      } catch {
        if (!cancelled) {
          setNotifications([]);
          setNotifTotal(0);
        }
      } finally {
        if (!cancelled) setNotifLoading(false);
      }
    }
    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce pencarian saat dropdown search terbuka
  useEffect(() => {
    if (!searchOpen) return;
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const q = encodeURIComponent(cleanQuery);
        const [householdsRes, billsRes] = await Promise.all([
          fetch(`/api/households?q=${q}&isActive=true`),
          fetch(`/api/bills?q=${q}`),
        ]);
        const householdsData = await householdsRes.json();
        const billsData = await billsRes.json();
        const households = householdsData.success ? householdsData.data : [];
        const bills = billsData.success ? billsData.data : [];

        const householdResults: SearchResult[] = households.slice(0, 4).map((h: any) => ({
          id: h.id,
          kind: "household" as const,
          label: h.head_of_family_name,
          sublabel: `Rumah ${h.house_number}`,
          badge: HOUSE_BADGE[h.house_status]?.text || "Tetap",
        }));

        const billResults: SearchResult[] = bills.slice(0, 4).map((b: any) => ({
          id: b.id,
          kind: "bill" as const,
          label: b.household_name,
          sublabel: `Rumah ${b.house_number} · ${b.period}`,
          badge: STATUS_LABEL[b.status]?.text || b.status,
        }));

        setResults([...householdResults, ...billResults].slice(0, 6));
        setHasSearched(true);
      } catch {
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchOpen]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSearch = () => {
    setNotifOpen(false);
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const openNotifications = () => {
    setSearchOpen(false);
    setNotifOpen((prev) => !prev);
  };

  const goToResult = (result: SearchResult) => {
    setSearchOpen(false);
    setQuery("");
    if (result.kind === "household") {
      router.push("/admin/households");
    } else {
      router.push("/admin/bills");
    }
  };

  const goToBillList = (status: "unpaid" | "partial") => {
    setNotifOpen(false);
    router.push(`/admin/bills?status=${status}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-slate-800 font-bold">{title}</span>
          <span className="text-slate-300">/</span>
          <span>{subtitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Button + Dropdown */}
        <div className="relative" ref={searchRef}>
          <button
            type="button"
            onClick={openSearch}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              searchOpen
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            aria-label="Pencarian"
          >
            <Search className="h-4 w-4" />
          </button>

          {searchOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama warga / nomor rumah..."
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {isSearching && (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    Mencari...
                  </div>
                )}

                {!isSearching && query.trim().length < 2 && (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    Ketik minimal 2 huruf untuk mencari warga atau tagihan.
                  </div>
                )}

                {!isSearching && hasSearched && results.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    Tidak ada hasil untuk &ldquo;{query.trim()}&rdquo;
                  </div>
                )}

                {!isSearching &&
                  results.map((item) => (
                    <button
                      key={`${item.kind}-${item.id}`}
                      onClick={() => goToResult(item)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          item.kind === "household"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.kind === "household" ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Receipt className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800">
                          {item.label}
                        </span>
                        <span className="block truncate text-xs text-slate-400">
                          {item.sublabel}
                        </span>
                      </span>
                      <span className="shrink-0">
                        {householdBadge(item.badge)}
                      </span>
                    </button>
                  ))}
              </div>

              <div className="border-t border-slate-100 px-4 py-2 text-center text-[11px] text-slate-400">
                Pencarian warga &amp; tagihan bulanan
              </div>
            </div>
          )}
        </div>

        {/* Notification Button + Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={openNotifications}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              notifOpen
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            {notifTotal > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white flex items-center justify-center">
                {notifTotal > 9 ? "9+" : notifTotal}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-teal-700" />
                  <span className="text-sm font-bold text-slate-800">Tunggakan Iuran</span>
                </div>
                {notifTotal > 0 && (
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600 border border-rose-200">
                    {notifTotal} warga
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifLoading && (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    Memuat data...
                  </div>
                )}

                {!notifLoading && notifications.length === 0 && (
                  <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    <p className="text-sm font-semibold text-slate-700">
                      Tidak ada tunggakan
                    </p>
                    <p className="text-xs text-slate-400">
                      Semua warga sudah membayar iuran bulan ini. 🎉
                    </p>
                  </div>
                )}

                {!notifLoading &&
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => goToBillList(n.status)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          n.status === "unpaid"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800">
                          {n.household_name}
                        </span>
                        <span className="block truncate text-xs text-slate-400">
                          Rumah {n.house_number} · {n.period}
                        </span>
                      </span>
                      <span className="shrink-0">
                        {statusBadge(n.status)}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </button>
                  ))}
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  onClick={() => goToBillList("unpaid")}
                  className="w-full rounded-lg py-2 text-center text-xs font-bold text-teal-700 hover:bg-teal-50 transition"
                >
                  Lihat Semua Tagihan →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 font-bold text-white text-xs shadow-xs">
            BS
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-700">
            Budi S.
          </span>
        </div>
      </div>
    </header>
  );
};

function householdBadge(text: string) {
  const isKontrakan = text === "Kontrakan";
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
        isKontrakan
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      {text}
    </span>
  );
}

function statusBadge(status: "unpaid" | "partial") {
  const isUnpaid = status === "unpaid";
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
        isUnpaid
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {isUnpaid ? "Belum Bayar" : "Sebagian"}
    </span>
  );
}