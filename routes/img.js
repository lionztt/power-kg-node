const router = require('koa-router')()
const { downloadImg } = require('../service/blob')

router.prefix('/api/img')

router.post('/',async function (ctx, next) {
    const data = await downloadImg(ctx.request.body.img)
    ctx.body = data
})

module.exports = router