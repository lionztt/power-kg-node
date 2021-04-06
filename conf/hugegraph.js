const GRAPH = "hugegraph"
const base_url = 'http://127.0.0.1:8081'
const GREMLIN_URL = base_url+'/gremlin'
const VERTEX_URL = base_url+`/graphs/${GRAPH}/graph/vertices`
const EDGES_URL = base_url+`/graphs/${GRAPH}/graph/edges`
const MAX_NODES_LIMIT = 250 // 最大点数
const MAX_EDGES_LIMIT = 800000 // 最大边数

module.exports = {
    GRAPH,
    GREMLIN_URL,
    MAX_EDGES_LIMIT,
    MAX_NODES_LIMIT,
    VERTEX_URL,
    EDGES_URL
}