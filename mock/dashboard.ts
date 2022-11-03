import { router } from './base'
import Mock from 'mockjs'


router.any("/dashboard/total", (req, res, next) => {
  let result = JSON.stringify(Mock.mock({
    "total1|10000-99999": 10000,
    "total2|10000-99999": 10000,
    "total3|10000-99999": 10000,
    "total4|10000-99999": 10000,
  }))
  res.end(result)
})



export default router