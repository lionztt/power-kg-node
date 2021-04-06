// 发请求
const axios = require('axios');
const { GREMLIN_URL, GRAPH } = require('../conf/hugegraph')

// 查询器
function gremlinQuery(gql) {
    console.log("query gql: ", gql)
    return new Promise((resolve, reject) => {
        let requestData = {
            "gremlin": gql,
            "bindings": {},
            "language": "gremlin-groovy",
            "aliases": { "graph": GRAPH, "g": `__g_${GRAPH}` }
        }
        axios.post(GREMLIN_URL, requestData)
            .then((response) => {
                if (response.status == 200 && response.data &&
                    response.data.status.code == 200 &&
                    response.data.result && response.data.result.data) {
                    resolve(response.data.result.data);
                } else {
                    console.error("request gremlin failed", response);
                }
            })
            .catch((error) => {
                reject(error);
            })
    })
}

module.exports = {
    gremlinQuery
}
