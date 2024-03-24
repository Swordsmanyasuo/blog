import axios from 'axios'

import qs from 'qs'

import { ElLoading, ElMessage } from 'element-plus'

import router from '@/router'
import Message from '@/utils/Message'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const contentTypeFile = 'multipart/form-data'



const request = (config) => {
    let url = config.url;
    let params = config.params || {}
    let dataType = config.dataType == undefined ? 'form' : config.dataType;
    let showLoading = config.showLoading;
    showLoading = showLoading == undefined ? true : showLoading;
    let contentType = contentTypeForm;
    if (dataType == 'form') {
        //表单
        params = qs.stringify(params);
    } else if (dataType == 'json') {
        //json
        contentType = contentTypeJson;
    } else if (dataType == 'file') {
        //上传文件
        contentType = contentTypeFile;
        let param = new FormData();// 创建form对象
        /*  param.append('file', params.file);
         param.append(); */
        for (let key in params) {
            param.append(key, params[key]);
        }
        params = param;
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }
    let loading = null;
    const instance = axios.create({
        baseURL: '/api',
        timeout: 10 * 1000,
        headers: headers,
    });

    //请求前拦截器
    instance.interceptors.request.use(
        (config) => {
            if (showLoading) {
                loading = ElLoading.service({
                    lock: true,
                    text: '加载中......',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
            }
            return config;
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            console.error("请求发送失败:", error);
            Message.error("请求发送失败");
            return Promise.reject("请求发送失败");
        }
    );
    //请求后拦截器
    instance.interceptors.response.use(
        (response) => {
            if (showLoading && loading) {
                loading.close()
            }
            const responseData = response.data;
            //正常请求
            if (responseData.code == 200) {
                return responseData;
            } else if (responseData.code == 901) {
                //登录超时
                sessionStorage.clear();
                setTimeout(() => {
                    router.push('/login')
                }, 2000);
                return Promise.reject("登录超时");
            } else {
                //其他错误
                if (config.errorCallback) {
                    config.errorCallback();
                }
                return Promise.reject(responseData.info);
            }
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            return Promise.reject("网络异常")
        }
    );

    return instance.post(url, params).catch(error => {
        //console.error(error);
        Message.error(error);
        return null;
    });
    /* let result = new Promise((resolve, reject) => {
        instance.post(url, params).then(res => {
            resolve(res);
        }).catch(error => {
            ElMessage({
                type: 'error',
                message: error,
                duration: 2000,
            })
        });
    });
    return result; */
};

export default request;
