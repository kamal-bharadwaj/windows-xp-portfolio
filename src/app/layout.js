import './globals.css';

export const metadata = {
  title: 'Kamal Kumar — Windows XP Portfolio',
  description:
    'Portfolio of Kamal Kumar, B.Tech CSE student, AI researcher, and full-stack developer. Styled as a Windows XP desktop experience.',
  keywords: 'Kamal Kumar, portfolio, computer science, AI, React, Next.js, DRDO, developer',
  openGraph: {
    title: 'Kamal Kumar — Windows XP Portfolio',
    description: 'Interactive Windows XP-themed developer portfolio',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
