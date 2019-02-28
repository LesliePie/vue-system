import Cookies from 'js-cookie'
//cookie 类
const TokenKey = 'token'

const cookie={};

cookie.getToken= function() {
    return Cookies.get(TokenKey)
}

cookie.setToken= function (token) {
    return Cookies.set(TokenKey, token)
}

cookie.removeToken= function removeToken() {
    return Cookies.remove(TokenKey)
}
export  default cookie;
