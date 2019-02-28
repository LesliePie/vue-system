import axios from 'axios';
const front=axios.create({
    baseURL:'http://api.shihu45.com/pro/'

});
export default front;
