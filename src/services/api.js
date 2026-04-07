import axios from 'axios'

const api = axios.create({
    baseURL: 'https://estudo-crud.onrender.com'
})

export default api