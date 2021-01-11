import { Request, Response, NextFunction } from 'express'

import { ssrService } from './ssr.service'

export const ssrReactApp = async (req: Request<{}>, res: Response, next: NextFunction) => {
  try {
    const html = ssrService.render(req.url)

    res.send(html)

  } catch (err) {
    next(err)
  }
}

export const ssrRawHtml  = async (req: Request<{}>, res: Response, next: NextFunction) => {
  try {
    const html = ssrService.render('/', false)

    res.send(html)

  } catch (err) {
    next(err)
  }
}