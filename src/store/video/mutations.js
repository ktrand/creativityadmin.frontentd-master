export default {
    SET_VIDEOS(state, videos){
        state.videos = videos
    },
    SET_VIDEO(state, video){
        state.videos.push(video)
    },
    UPDATE_VIDEO(state, video){
        const index = state.videos.findIndex(el => el.id === video.id)
        state.videos.splice(index, 1, video)
    },
    DELETE_VIDEO(state, videoId){
        const index = state.videos.findIndex(el => el.id === videoId)
        state.videos.splice(index, 1)
    },
    TOGGLE_PUBLISH(state, video){
        const index = state.videos.findIndex(el => el.id === video.id)
        state.videos.splice(index, 1, video)
    },
    DELETE_SELECTED_CATEGORY(state, selected){
        selected.forEach(categoryId => {
            const index = state.categories.findIndex(el => el.id === categoryId)
            state.categories.splice(index, 1)
        })
    }
}