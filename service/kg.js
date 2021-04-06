const { gremlinQuery } = require('../service/hugegraph')
const { MAX_EDGES_LIMIT } = require('../conf/hugegraph')

// 通用查询图通过gql
async function queryGraphByGql(gql) {
    let retData = {
        'result': null,
        'type': null,
        'graph': null,
    }
    let data = await gremlinQuery(gql);
    retData.result = data;
    if (!data || data.length == 0) {
        return Promise.resolve(retData)
    }
    let dataType = data[0].type
    if (!dataType && data[0].objects) {
        dataType = "path"
    }
    retData.type = dataType
    retData.graph = await buildGraph(dataType, data);
    return Promise.resolve(retData)
}

// 构建图
async function buildGraph(type, data) {
    if (!data || data.length == 0) {
        return
    }
    let graph = {
        'nodes': [
            /**
             * {
      "id": "16:2K",
      "label": "params",
      "type": "vertex",
      -"properties": {
      "name": "2K",
      "baike": "2K分辨率（英文名2K resolution）是一个通用术语，指屏幕或者内容的水平分辨率达约2000像素的分辨率等级。",
      "img": "https://bkimg.cdn.bcebos.com/pic/3c6d55fbb2fb431668816b4f2ea4462309f7d36c?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg",
      "properties": "{\"中文名\": \"2K分辨率\", \"外文名\": \"2K resolution\", \"应    用\": \"影院荧幕，电视机，互联网媒体，手机屏幕\", \"常见格式\": \"2560*1440 1920*1080\"}"
      }
        } 
             */
        ],
        'edges': [

            /**
             * {
      "id": "S3:管件>4>>S4:损伤",
      "label": "注意现象",
      "type": "edge",
      "outV": "3:管件",
      "outVLabel": "电力实体",
      "inV": "4:损伤",
      "inVLabel": "电力现象",
      "properties": { }
      }
             */
        ]
    }
    switch (type) {
        case 'vertex': {
            graph.nodes = data
            let vertexIds = data.map(x => x.id)
            let edges = await queryEdgesWithFilter(vertexIds)
            graph.edges = edges
            break
        }
        case 'edge': {
            graph.edges = data
            let inV = data.map(x => x.inV)
            let outV = data.map(x => x.inV)
            let edgeIds = Array.from(new Set(...inV, ...outV))
            let nodes = await queryVertices(edgeIds)
            graph.nodes = nodes
            break
        }
        case 'path': {
            if (data[0].objects && data[0].objects.length > 0) {
                let nodes = []
                let edges = []
                data[0].objects.forEach(x => {
                    if ("vertex" == x.type) {
                        nodes.push(x)
                    } else if ("edge" == x.type) {
                        edges.push(x)
                    }
                });
                graph.nodes = nodes
                graph.edges = edges
            }
            break
        }
        default:
    }
    return graph;
}

// 查询边信息
async function queryEdgesWithFilter(vertIds) {
    let vertIdsStr = JSON.stringify(vertIds)
    let gql = `
    def vs = ${vertIdsStr}
    g.V(vs).aggregate('s')
    .bothE().where(otherV().where(within('s'))).dedup().limit(${MAX_EDGES_LIMIT})`
    return gremlinQuery(gql);
}

// 查询顶点信息
async function queryVertices(vertIds) {
    let vertIdsStr = vertIds.join("','")
    let gql = `g.V('${vertIdsStr}')`
    return gremlinQuery(gql);
}

module.exports = {
    queryGraphByGql
}