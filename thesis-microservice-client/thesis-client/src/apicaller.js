import axios from 'axios'
import * as config from './config'
export default function callApi(endpoint, method = 'get', body){
    return axios ({
        method: method,
        url: `${config.API_URL}/${endpoint}`,
        data: body,
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}`
          },
    }).catch( err =>{
        console.log(err);
    })
}