export default{
    GET_VIDEOS({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.get('video').then(response => {
            commit('SET_VIDEOS', response.data.videos)
            context.$vs.loading.close()
        })
    },
    CREATE_VIDEO({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        let formData = new FormData()
        formData.append('title', context.title)
        formData.append('img', context.dataImg)
        formData.append('category_id', context.category)
        formData.append('description', context.description)
        context.$http.post('/video', formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
            
            context.$vs.loading.close()
            commit('SET_VIDEO', response.data.video)
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
    },
    UPDATE_VIDEO({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        let formData = new FormData()
        formData.append('title', context.title)
        formData.append('img', context.dataImg)
        formData.append('category_id', context.category)
        formData.append('description', context.description)
        context.$http.post(`video/${context.data.id}`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            
            context.$vs.loading.close()
            commit('UPDATE_VIDEO', response.data.video)
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
    },
    DELETE_VIDEO({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.delete(`video/${context.deletedId}`).then(() => {
            
            context.$vs.loading.close()
            commit('DELETE_VIDEO', context.deletedId)
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
    },
    TOGGLE_PUBLISH({commit}, context){
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.put(`video/toggle_publish/${context.publishedId}`,{
            videoId:context.publishedId
        }).then(response => {
            
            context.$vs.loading.close()
            commit('TOGGLE_PUBLISH', response.data.video)
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
                text: err.response.data.errors.videoId,
                color:'warning',
                position: 'top-center',
                icon:'error'
            })
        })
    }
    // DELETE_SELECTED_CATEGORY({commit}, context){
    //     const obj = {selected: context.selectedId}
    //     context.$http.patch(`category/delete_selected`, obj).then(() => {
    //         commit('DELETE_SELECTED_CATEGORY', context.selectedId)
    //     })
    // }
}