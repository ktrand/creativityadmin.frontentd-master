export default {
    SET_TOKEN(state, response) {
        localStorage.setItem('creativity-user-token', response[0]);
        localStorage.setItem('creativity-user-profile', JSON.stringify(response[1]));
        state.token = response[0];
        state.user = JSON.stringify(response[1]);
        state.isAuthenticated = true
    },

    SET_PERMISSIONS(state, response) {
        localStorage.setItem('user-permissions', JSON.stringify(response));
        state.permissions = JSON.stringify(response);
    },

    PERMS_LOADED(state, load) {
        state.permissionsLoaded = load;
    },

    UNSET_TOKEN(state) {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-profile');
        localStorage.removeItem('user-permissions');
    },

    SET_ERROR(state) {
        state.error = true
    },

    UNSET_ERROR(state) {
        state.error = false
    },

    SET_PROCESS(state) {
        state.process = true
    },

    UNSET_PROCESS(state) {
        state.process = false
    },

    UPDATE_USER_DATA(state, user_data){
        localStorage.setItem('user-profile', user_data);
        state.user = user_data;
    },
}
