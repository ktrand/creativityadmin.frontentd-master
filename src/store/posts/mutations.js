export default {
    SET_POSTS(state, posts){
        state.posts = posts
    },
    SET_POST(state, post){
        state.posts.push(post)
    },
    UPDATE_POST(state, post){
        const index = state.posts.findIndex(el => el.id === post.id)
        state.posts.splice(index, 1, post)
    },
    DELETE_POST(state, postId){
        const index = state.posts.findIndex(el => el.id === postId)
        state.posts.splice(index, 1)
    },
    DELETE_SELECTED_POSTS(state, selected){
        selected.forEach(postId => {
            const index = state.posts.findIndex(el => el.id === postId)
            state.posts.splice(index, 1)
        })
    },
    TOGGLE_PUBLISH(state, post){
        const index = state.posts.findIndex(el => el.id === post.id)
        state.posts.splice(index, 1, post)
    },
}