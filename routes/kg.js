const router = require('koa-router')()
const {
  getKG,
  getEntityOne,
  getEntityTwo,
  getEntity,
  getRelationPath,
  newEntity,
  updateEntity,
  delEntity,
  newEdge,
  delEdge
} = require('../controller/kg')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/kg')

// 获取全图
router.get('/',async function (ctx, next) {  
  const data = await getKG()
  ctx.body = new SuccessModel(data)
})

// 查询实体
router.get('/entity',async function (ctx, next) {
  console.log(ctx.query)
  const queryType = ctx.query.type
  const entityName = ctx.query.entity
  let data = null
  if(entityName){
    switch(queryType){
      case '1':
        // 一度关系
        data = await getEntityOne(entityName)
        break;
      case '2':
        // 二度关系
        data = await getEntityTwo(entityName)
        break;
      default:
        // 实体
        data = await getEntity(entityName)
    }
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel("参数格式不对！")
})

// 查询关系
router.get('/relation',async function (ctx, next) {
  const e1 = ctx.query.e1
  const e2 = ctx.query.e2
  console.log(e1,e2)
  if(e1&&e2){
    const data = await getRelationPath(e1,e2)
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new SuccessModel(data)
})

// 增加实体
router.post('/new-entity', async function (ctx, next) {
  const entityName = ctx.request.entityName
  const entityType = ctx.request.entityType
  if(entityName&&entityType){
    const entityImg = ctx.request.entityImg
    const entityBaike = ctx.request.entityBaike
    const entityProps = ctx.request.entityProps
    const data = await newEntity(entityType,{name:entityName,img:entityImg,baike:entityBaike,properties:entityProps})
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel("参数格式不对！")
})

// 修改实体
router.post('/update-entity', async function (ctx, next) {
  const entityId = ctx.request.entityId
  const entityType = ctx.request.entityType
  if(entityId&&entityType){
    const entityName = ctx.request.entityName
    const entityImg = ctx.request.entityImg
    const entityBaike = ctx.request.entityBaike
    const entityProps = ctx.request.entityProps
    const data = await updateEntity(entityType,entityId,{name:entityName,img:entityImg,baike:entityBaike,properties:entityProps})
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel("参数格式不对！")
})

// 删除实体
router.post('/del-entity', async function (ctx, next) {
  const entityId = ctx.request.entityId
  const entityType = ctx.request.entityType
  if(entityId&&entityType){
    const data = await delEntity(entityType,entityId)
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel("参数格式不对！")
})

// 增加关系
router.post('/new-entity', async function (ctx, next) {
  const e1Name = ctx.request.e1Name
  const e1Type = ctx.request.e1Type
  const relation = ctx.request.relation
  const e2Name = ctx.request.e2Name
  const e2Type = ctx.request.e2Type
  if(e1Name&&e1Type&&relation&&e2Name&&e2Type){
    const edge = {
      e1Name,
      e1Type,
      relation,
      e2Name,
      e2Type
    }
    const data = await newEdge(edge)
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel("参数格式不对！")
})

// 删除关系
router.post('/del-entity', async function (ctx, next) {
  const relation = ctx.request.relation
  const relationId = ctx.request.relationId
  if(relation&&relationId){
    const data = await delEdge(relation,relationId)
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel("参数格式不对！")
})

module.exports = router
