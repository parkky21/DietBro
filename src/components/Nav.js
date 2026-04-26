import Image from 'next/image';

export default function Nav() {
  return (
    <nav>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Image src="/logo.png" alt="Diet Bro Logo" width={32} height={32} style={{ borderRadius: '4px' }} />
        <div>Diet<span>Bro</span></div>
      </div>
      <div className="nav-badge">ur glow up era starts here 🔥</div>
    </nav>
  );
}
