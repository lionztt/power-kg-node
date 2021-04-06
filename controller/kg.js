const { gremlinQuery } = require('../service/hugegraph')
const { queryGraphByGql } = require('../service/kg')
const { MAX_NODES_LIMIT } = require('../conf/hugegraph')

const getKG = async () => {
    // 查全图
    let gql = `g.V().limit(${MAX_NODES_LIMIT})`
    return await queryGraphByGql(gql)
}

const getEntityOne = async (entityId) => {
    let gql = `g.V('${entityId}').as("s").union(both(),select("s"))`
    return await queryGraphByGql(gql)
}

const getEntityTwo = async (entityId) => {
    let gql = `g.V('${entityId}').as("s").union(both(),both().both(),select("s"))`
    return await queryGraphByGql(gql)
}

const getEntity = async (entityName) => {
    let gql = `g.V().has('name', is('${entityName}'))`
    return await queryGraphByGql(gql)
}

const getRelationPath = async (e1,e2) => {
    let maxLimit = 6
    let gql = `
    g.V().has('name',is('${e1}'))
    .repeat(bothE().otherV().simplePath())
    .until(has('name', '${e2}').and().loops().is(lte(${maxLimit})))
    .has('name', '${e2}')
    .path()
    .limit(1)`
    return await queryGraphByGql(gql)
}

const newEntity = async (label, properties) => {
    return new Promise((resolve,reject)=>{
        let requestData = {
          "label": label,
          "properties": properties
      }  
      axios.post(VERTEX_URL, requestData)
      .then((response) => {
        if (response.status == 201) {
          resolve("ok");
        } else {
          reject(`insert node failed, message:${response.data.message}`);
        }
      })
      .catch((error) => {
        reject(error);
      })
    })    
}

const updateEntity = async (label, id, properties) => {
    return new Promise((resolve,reject)=>{
        let requestData = {
          "label": label,
          "properties": properties
      }  
      axios.put(VERTEX_URL + `/"${id}"?action=append`)
      .then((response) => {
        if (response.status == 204) {
          resolve("ok");
        } else {
          reject(`delete node failed, message:${response.data.message}`);
        }
      })
      .catch((error) => {
        reject(error);
      })
    }) 
}

const delEntity = async (label, id) => {
    return new Promise((resolve,reject)=>{
        let requestData = {
          "label": label,
          "properties": properties
      }  
      axios.delete(VERTEX_URL + `/"${id}"?label=${label}`)
      .then((response) => {
        if (response.status == 204) {
          resolve("ok");
        } else {
          reject(`delete node failed, message:${response.data.message}`);
        }
      })
      .catch((error) => {
        reject(error);
      })
    })
}

// 插入边
/**
  "params": 
  {
  "outV": "1:peter",
   "inV": "2:lop",
   "outVLabel": "person",
   "inVLabel": "software"
  }
 */
const newEdge = async (edge) => {
    return new Promise((resolve,reject)=>{
        let requestData = {
          "label": edge.relation,
          "outV": edge.e1Name,
          "inV": edge.e2Name,
          "outVLabel": edge.e1Type,
          "inVLabel": edge.e2Type,
          "properties": {
          }
      }  
      axios.post(EDGES_URL, requestData)
      .then((response) => {
        if (response.status == 201) {
          resolve("ok");
        } else {
          reject(`insert edge failed, message:${response.data.message}`);
        }
      })
      .catch((error) => {
        reject(error);
      })
    })
    
}

const delEdge = async (label, id)=>{
    return new Promise((resolve,reject)=>{
      let requestData = {
        "label": label,
        "properties": properties
    }  
    axios.delete(VERTEX_URL + `/"${id}"?label=${label}`)
    .then((response) => {
      if (response.status == 204) {
        resolve("ok");
      } else {
        reject(`delete node failed, message:${response.data.message}`);
      }
    })
    .catch((error) => {
      reject(error);
    })
  })
  }

module.exports = {
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
}