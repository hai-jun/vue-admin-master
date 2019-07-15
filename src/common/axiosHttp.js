'use strict'

import axios from 'axios'
import qs from 'qs'
// import store from '../store'
import axiosConfig from './axiosConfig'
import appConfig from "./appConfig.js";
import routes from '../routes';
import Vue from "vue";

axios.defaults.timeout = 15000; //响应时间
//配置请求头 
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//请求地址
axios.defaults.baseURL = appConfig.baseUrl;

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    if (config.data instanceof FormData) { // 如果是FormData类型，表示为上传图片
        return config;
    }
    if (config.headers.UseFormData == false) {
        return config;
    }
    var dataParams = {
        "encData": "", // 加密后的参数
        "encKey": "" // 加密的Key
    }
    // 对请求参数进行统一处理
    if (config.data) {
        dataParams.encData = JSON.stringify(config.data),
        dataParams.encKey = ""
        config.data = dataParams;
    }

    let accessToken = sessionStorage.getItem("access-token");
    if (accessToken) {
        config.headers['Authorization'] = sessionStorage.getItem("access-token");
    }

    //处理不同的请求类型
    if (config.method === 'post') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        config.data = qs.stringify(config.data);
    }
    if (config.method === 'get') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (config.data) {
            config.url += "?" + qs.stringify(config.data);
        }
    }
    return config;
}, (error) => {
    // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
});
// 
axios.interceptors.response.use(response => {
    return response
}, error => {
    
    return Promise.resolve(error.response)
})

function checkStatus(response) {
    var vm = new Vue({ routes });
    if (response && (response.status === 200 || response.status === 304 ||response.status === 400) ) {
      if (response == null || response == undefined) {
        return;
      }
      var resultData = response.data;
      // console.log(response)
      if (resultData.code == 10002) { //修改 2018-10-11
        vm.$alert("您的账号在其它的地方登入，请重新登入!", "警告", {
          confirmButtonText: "确定",
          callback: action => {
            // if(sessionStorage.getItem("access-type") === 'poto')
            // {
                sessionStorage.clear();
            //     window.location.href= appConfig.baseUrl + "/";
            // }
            // else{
                vm.$router.push('/');
            // }
          }
        });
        
        return response.data;
      } else if (resultData.code == 10005) {
       
        setTimeout(function(){
            vm.$alert('您的账号在其它的地方登入，请重新登入!', '重要提示', {
                confirmButtonText: '确定',
                callback: action => {
                // $scope.tag = true;
                sessionStorage.clear();
                    vm.$router.push('/');
          }

              });
            
        },500)
        
        
        return response.data;
      }
      return response.data;
      // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    // store.dispatch('errStatus', true);
    return {
      code: -404,
      msg: "系统异常，请稍后再试",
      data: null
    };
  }

function checkCode(res) {
    // store.dispatch('setLoadingStatus', false);
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === 500) {
        this.$alert(res.msg, '重要提示', {
            confirmButtonText: '确定',
          });
        
    }
    if (res.data && (!res.data.success)) {
        this.$alert(res.data.error_msg, '重要提示', {
            confirmButtonText: '确定',
          });
    }
    return res
}

export default {
    //返回一个Promise(发送post请求)
    axiosPost(url, params) {
        return new Promise((resolve, reject) => {
            // store.dispatch('setLoadingStatus', true);
            axios.post(url, params)
                .then(response => {
                    resolve(checkStatus(response));
                }, err => {
                    reject(checkCode(err));
                })
                .catch((error) => {
                    reject(checkCode(error))
                })
        })
    },
    //返回一个Promise(发送上传文件请求)
    axiosUpload(url, params) {
        return new Promise((resolve, reject) => {
            // store.dispatch('setLoadingStatus', true);
            axios({
                    method: 'post',
                    url: url,
                    data: params,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                })
                .then(response => {
                    resolve(response);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },



    // 特殊
    //返回一个Promise(发送post请求)
    axiosPosts(url, params) {
        return new Promise((resolve, reject) => {
            // store.dispatch('setLoadingStatus', true);
            axios({
                    method: 'post',
                    url: url,
                    data: params,
                    headers: {
                        'UseFormData': false,
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                })
                .then(response => {
                    resolve(response);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
}