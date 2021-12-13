export default{
    GET_CATEGORY({commit}, context){
        
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.get('category').then(response => {
            context.$vs.loading.close()
            commit('SET_CATEGORIES', response.data.categories)
        })
    },
    CREATE_CATEGORY({commit}, context){
        
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        let formData = new FormData()
        formData.append('title', context.dataName)
        formData.append('img', context.dataImg)
        context.$http.post('category', formData).then(response => {
            commit('SET_CATEGORY', response.data.category)
            
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
    },
    UPDATE_CATEGORY({commit}, context){
        
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        let formData = new FormData()
        formData.append('title', context.dataName)
        formData.append('img', context.dataImg)
        context.$http.post(`category/${context.data.id}`, formData).then(response => {
            commit('UPDATE_CATEGORY', response.data.category)
            
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
    },
    DELETE_CATEGORY({commit}, context){
        
        context.$vs.loading({color: 'rgb(228, 222, 37)' })
        context.$http.delete(`category/${context.deletedId}`).then(() => {
            commit('DELETE_CATEGORY', context.deletedId)
            
            context.$vs.loading.close()
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