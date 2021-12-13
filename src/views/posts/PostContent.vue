<template>
    <div>
        <div>
            <vs-button class="mr-5 mb-2" color="primary" type="filled" @click="addText">Добавить текст</vs-button>
            <vs-button class="mr-5 mb-2" color="success" type="filled" @click="addImage">Добавить картинку</vs-button>
            <vs-button v-if="updatePosition" color="warning" type="filled" @click="updatePositions">Сохранить изменения</vs-button>
            <vs-button v-else color="warning" type="filled" @click="save">Сохранить данный контент поста</vs-button>
        </div>
        <vs-popup :fullscreen="false"  class="holamundo" title="Добавление контента" :active.sync="popupActive">
            <div>
                <div class="mt-4 ml-2">
                    <img v-if="imgUrl" :src="imgUrl" alt="img" class="responsive" />
                    <vs-textarea v-if="textarea" icon-pack="feather"
                        class="w-full" 
                        icon="icon-edit-2" 
                        icon-after 
                        placeholder="Текст" 
                        v-model="text" />

                    <div class="upload-img mt-5" v-if="image">
                        <input
                            type="file"
                            class="hidden"
                            ref="uploadImgInput"
                            @change="updateCurrImg"
                            accept="image/*"
                        />
                        <vs-button v-if="!imgUrl" @click="$refs.uploadImgInput.click()">Выберите картинку</vs-button>
                    </div>
                    <vs-button color="success" class="mt-4" @click="add">Сохранить</vs-button>
                </div>
            </div>
        </vs-popup>
        <vs-popup :fullscreen="false"  class="holamundo" title="Изменение текста" :active.sync="updateText">
            <div>
                <div class="mt-4 ml-2">
                    <vs-textarea icon-pack="feather"
                        class="w-full" 
                        icon="icon-edit-2" 
                        icon-after 
                        placeholder="Текст" 
                        v-model="currentText.text" />
                    <vs-button color="success" class="mt-4" @click="changeCurrentText">Сохранить</vs-button>
                </div>
            </div>
        </vs-popup>
        <vs-popup :fullscreen="false"  class="holamundo" title="Изменение картинки" :active.sync="updateImg">
            <div>
                <div class="mt-4 ml-2">
                    <img v-if="imgUrlUpdating" :src="imgUrlUpdating" alt="img" class="responsive" />

                    <div class="upload-img mt-5">
                        <input
                            type="file"
                            class="hidden"
                            ref="uploadImgInput"
                            @change="updateCurrImg"
                            accept="image/*"
                        />
                        <vs-button @click="$refs.uploadImgInput.click()">Выберите картинку</vs-button>
                    </div>
                    <vs-button color="success" class="mt-4" @click="changeCurrentImg">Сохранить</vs-button>
                </div>
            </div>
        </vs-popup>
        <div class="vx-col w-full">
            <draggable :list="contents">
                <transition-group>
                <vx-card class="mt-base" v-for="(content, index) in contents" :key="index">
                    <div>
                        <!-- POST HEADER -->
                        <!-- <div class="post-header flex justify-between mb-4">
                            <div class="flex items-center">
                                <div>
                                    <vs-avatar class="m-0" :src="userLatestPhotos[0]" size="45px"></vs-avatar>
                                </div>
                                <div class="ml-4">
                                    <h6>{{ post.author }}</h6>
                                    <small>{{ post.time | datetime }}</small>
                                </div>
                            </div>
                            <div class="flex">
                                <feather-icon class="ml-4" icon="HeartIcon" :svgClasses="{'text-danger fill-current stroke-current': post.isLiked}"></feather-icon>
                            </div>
                        </div> -->

                        <!-- POST CONTENT -->
                        <div v-if="content.text" class="post-content">
                            <p>{{ content.text }}</p>
                        </div>
                        <div v-if="content.img" class="post-media-container mb-6 mt-4">
                            <img class="responsive rounded" :src="content.imgUrl ? content.imgUrl:($apiUrl+content.img)" alt="user-upload">
                        </div>
                        <div class="profile-actions pointer-events-auto flex mt-8">
                            <vs-button @click="content.img?changeImg(content, index):changeText(content,index)" icon-pack="feather" radius icon="icon-edit-2"></vs-button>
                            <vs-button @click="deleteContent(index, content.id)" icon-pack="feather" radius icon="icon-trash" class="ml-2 lg:ml-4"></vs-button>
                        </div>
                    </div>
                </vx-card>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>


<script>
import draggable from 'vuedraggable'
export default {
    data(){
        return{
            dataImg:"",
            image:false,
            imgUrl:"",
            post:null,
            popupActive: false,
            text: "",
            textarea: false,
            disabled: false,
            contents:[],
            position:0,
            updatePosition: false,
            updateText: false,
            currentText:{id:0,text:"", position:0},
            updateImg:false,
            currentImg:{},
            imgUrlUpdating: "",
            currentIndex:null,
        }
    },

    components:{draggable},

    methods:{
        getPostContents(){
            this.$http.get(`post/content/${this.$route.params.postId}`).then(response => {
                this.contents = response.data.post.post_contents
                if(this.contents.length > 0){
                    this.updatePosition = true
                    this.position = this.contents.length
                }
            })
        },

        add(){
            if(!this.text && !this.dataImg) return
            let content = {
                text: this.text,
                position: this.position
            }

            if(this.image){
                content = {
                    img: this.dataImg,
                    position: this.position,
                    imgUrl: this.imgUrl
                }
            }

            if(this.updatePosition){
                this.saveUpdating(content)
            }
            
            this.contents.push(content)
            this.position++

            this.popupActive = false
        },

        saveUpdating(content){
            this.$vs.loading({color: 'rgb(228, 222, 37)' })
            let formData = new FormData()
            formData.append('position', content.position)
            if(content.text){
                formData.append(`text`, content.text)
            }else{
                formData.append(`img`, content.img)
            }
            this.$http.post(`post/content/${this.$route.params.postId}`, formData).then(() => {
                this.$vs.loading.close()
            })
        },

        addText(){
            this.image = false
            this.textarea = true
            this.popupActive = true
        },

        addImage(){
            this.textarea = false
            this.image = true
            this.popupActive = true
        },

        updateCurrImg(input) {
            if (input.target.files && input.target.files[0]) {
                if(this.updateImg){
                    this.currentImg.image = input.target.files[0]
                }else{
                    this.dataImg = input.target.files[0];
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    if(this.updateImg){
                        this.imgUrlUpdating = e.target.result
                        this.currentImg.imgUrl = e.target.result
                    }else{
                        this.imgUrl = e.target.result;
                    }
                };
                reader.readAsDataURL(input.target.files[0]);
            }
        },

        normalize(){
            let buffer = []
            this.contents.forEach((el, index) => {
                buffer.push({
                    text:el.text,
                    img: el.img,
                    position: index,
                })
            })
            return buffer
        },

        save(){
            this.$vs.loading({color: 'rgb(228, 222, 37)' })
            const data = this.normalize()
            let formData = new FormData()
            data.forEach(el => {
                if(el.text){
                    formData.append(`text${el.position}`, el.text)
                }else{
                    formData.append(`img${el.position}`, el.img)
                }
            })
            this.$http.post(`post/contents/${this.$route.params.postId}`, formData).then(() => {
                this.$vs.loading.close()
                this.$router.push('/posts')
            })
        },

        updatePositions(){
            this.$vs.loading({color: 'rgb(228, 222, 37)' })
            let data = []
            this.contents.forEach((el, index) => {
                data.push({id:el.id, position: index})
            })

            this.$http.post(`post/content/update-positions/${this.$route.params.postId}`, data).then(() => {
                this.$vs.loading.close()
            })
        },

        deleteContent(index, postContentId = null){
            if(this.updatePosition && postContentId){
                this.$http.delete(`post/content/${postContentId}`).then(() => {
                })
            }
            this.contents.splice(index, 1)
        },

        changeText(content,index){
            this.currentIndex = index
            this.currentText = content
            this.updateText = true
        },

        changeCurrentText(){
            this.$vs.loading({color: 'rgb(228, 222, 37)' })
            if(!this.updatePosition && this.currentIndex){
                this.contents.splice(this.currentIndex, 1, this.currentText);
                this.$vs.loading.close()
                return
            }
            this.$http.post(`post/content/change/${this.currentText.id}`, {text:this.currentText.text}).then(() => {
                this.$vs.loading.close()
                this.updateText = false
            })
        },

        changeImg(content,index){
            this.currentIndex = index
            this.currentImg = content
            this.imgUrlUpdating = this.$apiUrl+content.img
            this.updateImg = true
        },

        changeCurrentImg(){
            this.$vs.loading({color: 'rgb(228, 222, 37)' })
            if(!this.updatePosition && this.currentIndex){
                this.contents.splice(this.currentIndex, 1, this.currentImg);
                this.$vs.loading.close()
                return
            }
            let formData = new FormData()
            formData.append('img', this.currentImg.image)
            this.$http.post(`post/content/change/${this.currentImg.id}`, formData).then(() => {
                this.$vs.loading.close()
                this.updateImg = false
            })
        },
    },

    watch:{
        popupActive(value){
            if(!value){
                this.imgUrl = ""
                this.image = false
                this.textarea = false
                this.text = null
            }
        }
    },

    mounted(){
        this.getPostContents()
    }
}
</script>