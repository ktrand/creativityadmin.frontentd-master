import axios from 'axios'
import store from './store/store'
import router from './router'
import Vue from 'vue'

const apiUrl = process.env.VUE_APP_API_URL;

export default () => {

    const http = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    http.interceptors.request.use(config => {
        config.headers.Authorization = 'Bearer ' + store.getters['auth/getToken'];
        return config
    });

    http.interceptors.response.use(response => {
        // do some staff like notifications and others
        return response
    }, error => {
        // нет соединения с интернетом
        if (!error.response) {

            errorMessageNotification('Нет соединения с интернетом. Перезагрузите страницу', 'warning');

            // router.push('/no-internet-connection');
            console.log('NO INTERNET CONNECTION');
        }
        // когда неавторизован
        if (error.response.status === 401) {

            errorMessageNotification('Вы не авторизованы, выполните вход', 'danger');

            store.commit('auth/UNSET_TOKEN');
            router.push('/login');
        }

        // нет доступа
        if (error.response.status === 403 || error.response.data.message === 'Access Denied!') {

            const permissionName = error.response.data.permission ? error.response.data.permission : '';

            const text = 'У вас недостаточно прав: <br/>' + '<strong>' + permissionName + '</strong>';

            errorMessageNotification(text, 'warning');
        }

        if (error.response.status === 422) {
            if (Array.isArray(error.response.data.errors)) {
                const errors = error.response.data.errors
                errors.forEach(el => {
                    errorMessageNotification(el.message, 'warning')
                })
            }else {
                const errors = Object.entries(error.response.data.errors)
                errors.forEach(element => {
                    errorMessageNotification(element[1][0], 'warning')
                });
            }
        }

        if (error.response.data.code === 404) {
            //router.replace('/pages/error-404');
        }

        return Promise.reject(error);
    });

    function errorMessageNotification(text, color, time = 5000) {
        const notify = new Vue()
        notify.$vs.notify({
            title: 'О, нет...',
            text: text,
            color: color,
            time: time,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            position: 'top-center',
        });

    }

    Vue.prototype.$http = http
}
