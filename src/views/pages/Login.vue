<template>
    <div class="h-screen flex w-full bg-img" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Вход</h4>
                                    <p>Пожалуйста войдите в свой аккаунт.</p>
                                </div>
                                <vs-input
                                    name="email"
                                    icon="icon icon-user"
                                    icon-pack="feather"
                                    label="Email"
                                    v-model="email"
                                    class="w-full no-icon-border"/>

                                <vs-input
                                    type="password"
                                    name="password"
                                    icon="icon icon-lock"
                                    icon-pack="feather"
                                    label="Пароль"
                                    v-model="password"
                                    class="w-full mt-6 no-icon-border" />

                                <p class="text-danger" v-if="authError">
                                    Неверно введен логин/пароль
                                </p>

                                <div class="flex flex-wrap justify-between my-5">
                                    <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Запомнить меня</vs-checkbox>
                                </div>

                                <vs-button 
                                           class="vs-con-loading__container"
                                           @click="login">
                                    Вход
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            email: '',
            password: '',
            checkbox_remember_me: false
        }
    },

    computed: {
        authError () {
            return this.$store.getters['auth/getError'];
        },

        authProcess () {
            return this.$store.getters['auth/getProcess']
        }
    },

    watch: {
        authProcess() {
            this.loading = this.authProcess
        },

        loading() {
            if (this.loading === true) {
                this.$vs.loading({
                    background: 'primary',
                    color: '#fff',
                    container: "#button-with-loading",
                    scale: 0.45
                });
            } else {
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
            }
        }
    },

    methods: {
        login () {
            this.loading = true            
            this.$store.dispatch('auth/SIGNIN', this);
        }
    },

    mounted() {
        setTimeout(() => {
            const appLoading = document.getElementById('loading-bg');
            if (appLoading) {
                appLoading.style.display = "none";
            }
        }, 1000);
    }
}
</script>
