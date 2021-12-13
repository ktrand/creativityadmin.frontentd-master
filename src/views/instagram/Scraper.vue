<template>
    <div>
        <vs-button @click="openPopup" type="border" color="success">
            Парсить пост
        </vs-button>

        <vs-popup classContent="popup-example" title="Instagram scraper" :active.sync="popupActive" fullscreen>
            <vs-row class="flex">
                <vs-col v-for="post in posts" :key="post.postId" class="m-3 post-block" vs-w="3">
                    <span class="cursor-pointer" @click="scrap(post.postId)">
                        <img class="FFVAD post-img" crossorigin="anonymous" decoding="auto" sizes="600px"  :src="post.img">
                    </span>
                </vs-col>
            </vs-row>
        </vs-popup>
    </div>
</template>


<script>
export default {
    data() {
        return {
            popupActive: false,
            postId: null,
            url: 'http://localhost:3000/api/',
            userName: 'n.daler20',
            posts: []
        }
    },

    methods: {
        openPopup(){
            this.getPosts()

            this.popupActive = true
        },
        scrap(postId){
            this.$vs.loading()
            this.$http.post(this.url+'scrap', {postId})
            .then(res => {
                console.log('ddd', res.data);
            }).finally(() => {
                this.$vs.loading.close()
                this.popupActive = false
            })
        },
        getPosts(){
            if (this.posts.length === 0) {
                this.$vs.loading()
                this.$http.get(this.url+'instagram/user/posts', {params: {userName: this.userName}})
                .then(res => {
                    this.posts = res.data.collector.map(el => {
                        return {
                            img: el.display_url,
                            postId: el.shortcode
                        }
                    })
                    console.log('dd', this.posts);
                }).finally(() => {
                    this.$vs.loading.close()
                })
            }
        }
    }
}
</script>

<style lang="scss">
    .post-img{
        width: 100%;
        height: 100%;
    }
</style>