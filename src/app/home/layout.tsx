"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  console.log(path);
  return (
    <html lang="en">
      <body>
        <nav className=" flex  gap-2 justify-around items-center shadow-lg">
          <h1 className="textPrimaryColor  text-xl font-bold ">TweetX</h1>
          <div className="flex gap-4  font-bold text-slate-300">
            <Link
              className={` hover:text-[#ff738c] ${
                path === "/home/feed" && "text-[#ff738c]"
              }  `}
              href={"/home/feed"}
              prefetch
            >
              Feed
            </Link>

            <Link
              className={` hover:text-[#ff738c] ${
                path === "/home/users" && "text-[#ff738c]"
              }  `}
              href={"/home/users"}
              prefetch
            >
              Users
            </Link>

            <Link
              className={` hover:text-[#ff738c] ${
                path === "/home/profile" && "text-[#ff738c]"
              }  `}
              href={"/home/profile"}
              prefetch
            >
              Profile
            </Link>
          </div>
        </nav>
        <main className="m-auto md:w-3/5 w-4/5 ">{children}</main>
      </body>
    </html>
  );
}
