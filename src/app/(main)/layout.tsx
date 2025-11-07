import SideBar from "@/components/layout/sideBar";
import s from "@/styles/main/index.module.css";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={s.main}>
      <SideBar />
      <div className={s.content}>{children}</div>
    </div>
  );
}
