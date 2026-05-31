'use client';
import dynamic from 'next/dynamic';

// Dynamically import the desktop app with no SSR (it uses browser APIs)
const XPDesktop = dynamic(() => import('@/components/XPDesktop'), {
  ssr: false,
  loading: () => (
    <div style={{ background: '#000', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontFamily: 'Arimo, Tahoma, sans-serif', fontSize: 13 }}>Loading...</div>
    </div>
  ),
});

export default function Home() {
  return <XPDesktop />;
}
