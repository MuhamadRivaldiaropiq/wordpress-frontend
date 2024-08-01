import Axios from 'axios'

const axiosWp = Axios.create({
    withCredentials: true,
})

export default axiosWp
