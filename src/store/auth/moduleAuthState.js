export default {
    isAuthenticated: false,
    error: false,
    token: localStorage.getItem('creativity-user-token') || null,
    user: localStorage.getItem('creativity-user-profile') || null,
    permissions: localStorage.getItem('user-permissions') || null,
    process: false,
    permissionsLoaded: false
}
