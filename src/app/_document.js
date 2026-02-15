import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https:; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https:; frame-src 'self' https:; connect-src 'self' https:; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:;"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
