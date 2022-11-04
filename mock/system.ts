import { router } from './base'
import Mock from 'mockjs'

router.get("/system/admin", (req, res, next) => {
  let result = JSON.stringify(Mock.mock({
    "list|10":[
      {
        "id|1-100":10,
        "email":"@email()",
        "nickname":"@first()",
        "updated_at":"@datetime",
        "created_at":"@datetime",
      }
    ],
    "total|200-300":50
  }))
  res.end(result)
})