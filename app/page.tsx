import { redirect } from 'next/navigation';

export default function RootPage() {
    // 访问根路径直接跳转到 /home
    redirect('/home');
}