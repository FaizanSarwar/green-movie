/* eslint-disable @next/next/next-script-for-ga */
import Document, { Html, Head, Main, NextScript } from 'next/document';

// Extending default document (DOM)
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <link rel="icon" href="/favicon.ico" />

          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`
              }}
            />
          )}
        </Head>
        <body>
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`
              }}
            />
          )}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
