const axios = require('axios');

// 获取远端图片
async function downloadImg(imgUrl) {
    console.log(imgUrl)
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: imgUrl,
            responseType: 'stream'
        }).then(function (response) {
            if (response.status == 200) {
                (async function () {
                    let databuffer = await streamToBuffer(response.data)
                    resolve(databuffer)
                })()
            } else {
                reject(`download image failed, status:${response.status}`)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('error', reject);
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => resolve(Buffer.concat(buffers)))
    })
}

module.exports = { downloadImg }
// (async function(){
//   await downloadImg("https://bkimg.cdn.bcebos.com/pic/34fae6cd7b899e51cf0f2d3741a7d933c8950d0b?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg")
// })()
