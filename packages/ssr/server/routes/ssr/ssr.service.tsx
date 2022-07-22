import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import { ServerRoutes } from '../../../client/routes'

export const ssrService = {
  render(url: string, bundle: boolean = true) {
    const sheet = new ServerStyleSheet()

    const app = renderToString(sheet.collectStyles(<ServerRoutes url={url}/>))    
  
    const initialState = { ssr: true }
  
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>SSR example</title>
        </head>
        <body>
          <div id="root">${app}</div>
          <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(initialState)}
          </script>
          ${bundle ? '<script type="text/javascript" src="/bundle.js"></script>' : ''}
          ${sheet.getStyleTags()}
        </body>
      </html>
    `
    sheet.seal()
    return html
  }
}
