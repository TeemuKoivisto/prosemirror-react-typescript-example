import { Request, Response, NextFunction } from 'express'

import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import { ServerRoutes } from '../client/routes'

export const ssrReactApp = async (req: Request<{}>, res: Response, next: NextFunction) => {

  let sheet

  try {
    sheet = new ServerStyleSheet()

    const app = renderToString(sheet.collectStyles(<ServerRoutes url={req.url}/>))    

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
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root">${app}</div>
          <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(initialState)}
          </script>
          <script type="text/javascript" src="/bundle.js"></script>
          ${sheet.getStyleTags()}
        </body>
      </html>
    `
    res.send(html)

  } catch (err) {
    next(err)
  } finally {
    sheet && sheet.seal()
  }
}
