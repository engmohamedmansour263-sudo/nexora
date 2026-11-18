"use client";
import { usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
const labels:Record<string,string>={en:"English",ar:"العربية",hi:"हिन्दी",bn:"বাংলা",es:"Español",pt:"Português"};
export default function LanguageSwitcher(){const locale=useLocale();const pathname=usePathname();const router=useRouter();return <select aria-label="Language" value={locale} onChange={e=>router.replace(pathname,{locale:e.target.value})} className="rounded-xl border border-white/10 bg-[#181a23] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-violet-400">{Object.entries(labels).map(([code,label])=><option key={code} value={code}>{label}</option>)}</select>}
