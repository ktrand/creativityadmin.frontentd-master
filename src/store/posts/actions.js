export default{
    GET_POSTS({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.get('post').then(response => {
            context.$vs.loading.close()
            commit('SET_POSTS', response.data.posts)
        })
    },
    CREATE_POST({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        let formData = new FormData()
        formData.append('title', context.dataName)
        formData.append('img', context.dataImg)
        context.$http.post('post', formData).then(response => {
            commit('SET_POST', response.data.post)
            context.$vs.loading.close()
        })
    },
    UPDATE_POST({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        let formData = new FormData()
        formData.append('title', context.dataName)
        formData.append('img', context.dataImg)
        context.$http.post(`post/${context.data.id}`, formData).then(response => {
            commit('UPDATE_POST', response.data.post)
            context.$vs.loading.close()
        })
    },
    DELETE_POST({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.delete(`post/${context.deletedId}`).then(() => {
            commit('DELETE_POST', context.deletedId)
            context.$vs.loading.close()
        })
    },

    TOGGLE_PUBLISH({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.put(`post/toggle_publish/${context.publishedId}`,{
            postId:context.publishedId
        }).then(response => {
            context.$vs.loading.close()
            commit('TOGGLE_PUBLISH', response.data.post)
            context.publishedId = null
            context.$vs.notify({
                title: 'Ураа...',
                text: "Опубликовано",
                color: 'success',
                iconPack: 'feather',
                position: 'top-center',
                icon: 'icon-alert-circle'
            })
        }).catch(err => {          
            context.$vs.loading.close()
            context.$vs.notify({
                title: 'Уппс!',
                text: err.response.data.errors.postId,
                color:'warning',
                position: 'top-center',
                icon:'error'
            })
        })
    },

    DELETE_SELECTED_CATEGORY({commit}, context){
        
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        const obj = {selected: context.selectedId}
        context.$http.patch(`category/delete_selected`, obj).then(() => {
            commit('DELETE_SELECTED_CATEGORY', context.selectedId)
            
            context.$vs.loading.close()
        }).catch(err => {
            
            context.$vs.loading.close()
            context.$vs.notify({
                time: 2500,
                title: 'Error',
                text: err.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                position: 'top-center',
                color: 'danger'
            });
        })
    }
}