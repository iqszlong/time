import { apiRequest,jsonRequest } from "@/utils/request";


export default {
    login: (data = {}) => apiRequest(`/auth/login`, { method: "POST", body: data }),
    verifyCode: (data = {}) => apiRequest(`/auth/verifyCode`, { method: "POST", body: data }),
    checkVerifyCode: (data = {}) => apiRequest(`/auth/checkVerifyCode`, { method: "POST", body: data }),
    register: (data = {}) => apiRequest(`/auth/register`, { method: "POST", body: data }),
    logout: () => apiRequest(`/auth/logout`),
    getUInfo:() => apiRequest(`/auth/info`),
    uploadFile: (formData) => apiRequest(`/upload`, { method: "POST", body: formData ,headers:{"Content-Type":false}}),
    getQiniuPutObject: (params = {}) => apiRequest(`/qiniu/put/object`, { params}),
};