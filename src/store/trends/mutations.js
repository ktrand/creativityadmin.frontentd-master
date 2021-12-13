export default {
    SET_CATEGORIES(state, categories){
        state.categories = categories
    },
    SET_CATEGORY(state, category){
        state.categories.push(category)
    },
    UPDATE_CATEGORY(state, category){
        const index = state.categories.findIndex(el => el.id === category.id)
        state.categories.splice(index, 1, category)
    },
    DELETE_CATEGORY(state, categoryId){
        const index = state.categories.findIndex(el => el.id === categoryId)
        state.categories.splice(index, 1)
    },
    DELETE_SELECTED_CATEGORY(state, selected){
        selected.forEach(categoryId => {
            const index = state.categories.findIndex(el => el.id === categoryId)
            state.categories.splice(index, 1)
        })
    }
}