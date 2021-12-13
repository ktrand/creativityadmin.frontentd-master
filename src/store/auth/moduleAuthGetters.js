export default {
    isUserAuthenticated: state => {
        if (state.token) {
            state.isAuthenticated = true
        }
        return state.isAuthenticated
    },

    getToken: state => {
        return state.token
    },

    getProfile: state => {
        return state.user
    },

    getError: state => {
        return state.error
    },

    getProcess: state => {
        return state.process
    },

    getPermissions: state => {
        return state.permissions
    },

    permsLoaded: state => {
        return state.permissionsLoaded
    }
}
