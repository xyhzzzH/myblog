import axois from 'axios'
import { ElLoading } from 'element-plus'
import Message from './Message'
import router from '../router'

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8"
const contentTypeJson = "application/json"
const contentTypeFile = "multipart/form-data"

const request = (config) => {
    let { url, params, dataType = 'form', showLoading = 'true' } = config;
    let contentType = contentTypeForm;
    if (dataType === 'json') {
        contentType = contentTypeJson
    } else if (dataType == 'file') {
        contentType = contentTypeFile;
        let param = new FormData();
        for (let key in params) {
            param.append(key, params[key])
        }
        params = param;
    }
    const instantce = axois.create({
        baseURL: '/api',
        timeout: 10 * 1000,
        headers: {
            'Content-Type': contentType,
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    let loading = null;
    instantce.interceptors.request.use(
        (config) => {
            if (showLoading) {
                loading = ElLoading.service({
                    lock: true,
                    text: 'Loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
            }
            return config;
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            Message.error('发送请求失败')
            return Promise.reject('发送请求失败');
        }
    )

    // 请求后拦截
    instantce.interceptors.response.use(
        (response) => {
            if (showLoading && loading) {
                loading.close();
            }
            const responseData = response.data;
            if (responseData.status == 'error') {
                if (config.errorCallback()) {
                    config.errorCallback();
                }
                return Promise.reject(responseData.info)
            } else {
                if (responseData.code == 200) {
                    return responseData;
                } else if (responseData.code == 901) {
                    // 请求超时后直接跳到首页
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                    return Promise.reject("登陆超时");
                }

            }
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            return Promise.reject(error)
        }
    )

    return instantce.post(url, params).catch(error => {
        Message.error(error)
        return null;
    })



}

export default request