import { router } from './base'
import Mock from 'mockjs'




router.any("/version", (req, res, next) => {
  res.end("0.0.1")
})

router.any("/captcha", (req, res, next) => {
  let uuid = Mock.Random.guid()
  let image = Mock.Random.dataImage('50x25', "1234")
  // let image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAABQAQMAAAAdh2o/AAAABlBMVEX///8AAABVwtN+AAADYUlEQVR4nMyVsYskxRfHP1VbM9c9v/lJX7OKJ9zZM9QueygGx4kgK5SLQU+zyJyiLnLIBpuoh5yoeSEGcyDSDpOYjcuigYmB0UUtXHBrIJdcau5/YCivenZve3puEw/xBUMzr9+n+n3rW6/4FyN78sj/nZPLn9QiybnZ+Px1ds7tWn9nPdFj02qaOjTuMWkzO4ZZzgUhrUgP44z0W6Bi3bfSg1Ln5rAIz4dn/l/00yfOmI1k7U7ahkdo1zvYlJXfHjR7GmVQQBlHZaVseaffrJzm6DHaqUwnjDbzg0Y2Hdk5E7QrnHbKTlvwAdoJHO4rW06a8PXpbhngNwhw11R/OrJH+ABnR9myaqaHqOQEniuLOrMzHmbe1PCxeGIE+1Rn4SDwVHovpLoJz0Dgxkc8/7XKGnBgBgJPGb+UXXyYC/xslDU84YsJhXoBlcUteGGOuhM278HPK+CMryb7422nDjHRCnj8xjd86unxAe/R+nIKu9+b8MzHjge9Uz++JT874OhPqyracp3f6HTWTvI6q40y5sXhTa6B8nf5y++dlG/L8RFp3fSQIzAZty9kemHVbeVBO+0S/rh/OwLj6XYuVdcXcP+0J0avzZPhTTYEDns+UtXJV3+OmRZjjPswS0GXUqPcpYDf1nP1stp8jcv6d+u7BFOld90Brz7gJ1R1xWN77yu/7k2ZeGkRQ46j+1k4HGNIiwOOUHYBT+m6p+rFteNHH//J/2+gc0WwQuS4wid7vAtchuJX+/08glzUzGAtHNPurVB/D50PbomR0hhUHmQKr9T45/ybrxSqDzb4Ejry9zuej+oXrv+SjsVAtlPv7lboufdwUR9n3Hk9g9jMw9qmud/Kqg3mkIom8g3N2WFLIp9Ivz4Mi6Vq47HzGZgvwzFhaXZczegEOKvhHgReylTM4aslOBiBW2r4tWZaplw1lsIBatC6AmSjXOzSHCuI2r6PQoNOCnM0pY/aZXkuixpZf3ZsWXfMvFjubMhGYYejYIYpbLXTrp7nbpXmIovW0r7VbVmMyBJMoHK/QpYS2UqJjbRsyaLs6cdaGfjlUmO5+WHx2C3asjAaPLt4So7zliykuyc8fTFrX7sychdRgF6Gq8Hp9aocTJbSDB9dfn55pNJq5T8WKy7lfxh/BwAA//+U9K/0/whL/gAAAABJRU5ErkJggg=='
  let result = JSON.stringify({
    "captchaID": uuid,
    "captchaURL": image
  })
  res.end(result)
})

router.any("/login", (req, res, next) => {
  let result = JSON.stringify(Mock.mock({
    "token": /[a-zA-Z0-9]{18}/
  }))
  res.end(result)
})

export default router