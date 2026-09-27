'use client'

import { useEffect, useState } from "react";
import { Mail, Loader2, Search, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((res) => res.json())
      .then((data) => setSubscribers(data.subscribers || []))
      .catch(() => toast.error("فشل جلب المشتركين"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const copyAll = () => {
    const emails = subscribers.map((s) => s.email).join("\n");
    navigator.clipboard.writeText(emails);
    toast.success("تم نسخ جميع البريدات");
  };

  const downloadCSV = () => {
    const csv = "email,createdAt\n" + subscribers.map((s) => `${s.email},${s.createdAt}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-1">
            المشتركون
          </h1>
          <p className="text-sm text-muted-foreground">
            {subscribers.length} مشترك في النشرة البريدية
          </p>
        </div>
        {subscribers.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyAll} className="gap-2">
              <Copy className="h-4 w-4" />
              نسخ الكل
            </Button>
            <Button variant="outline" onClick={downloadCSV} className="gap-2">
              <Download className="h-4 w-4" />
              تنزيل CSV
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث بالبريد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
            {search ? "لا توجد نتائج مطابقة" : "لا يوجد مشتركون بعد"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-right p-4 font-semibold text-foreground">البريد الإلكتروني</th>
                  <th className="text-right p-4 font-semibold text-foreground hidden md:table-cell">تاريخ الاشتراك</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-foreground" dir="ltr">{sub.email}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground text-xs">
                      {formatDate(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
