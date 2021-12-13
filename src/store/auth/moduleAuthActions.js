import router from '../../router';

export default {
    SIGNIN({commit}, context) {
        const data = {
            email: context.email,
            password: context.password,
            remember_me: context.checkbox_remember_me,
        };
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.post('login', data).then(response => {
            context.$vs.loading.close()
            commit('SET_TOKEN', [response.data.meta.token, response.data.data]);

            router.push('/')

            context.$vs.notify({
                position:'top-center',
                title: 'Успешный вход',
                text: 'С возвращением!',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'success'
            })

        }).catch(() => {
            context.$vs.loading.close()
            context.$vs.notify({
                time: 2500,
                title: 'Error',
                text: 'Ошибка авторизации',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                position: 'top-center',
                color: 'danger'
            });
        })
    },


    GET_AUTH(state) {
        if (state.token) {
            state.isAuthenticated = true
        }
    }
}
