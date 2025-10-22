// @ts-nocheck
export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>hp2025</h1>
      <p>GitHub Pages 向けに静的出力された Next.js アプリの初期ページです。</p>
      <ul>
        <li>API Origin: <code>{process.env.NEXT_PUBLIC_API_ORIGIN ?? 'not set'}</code></li>
      </ul>
    </main>
  );
}
