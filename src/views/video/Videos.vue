<template>
  <div id="data-list-thumb-view" class="data-list-container">

    <video-sidebar v-if="flag" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" :categories="categories" />

    <vs-table ref="table" v-if="flag" v-model="selected" multiple pagination :max-items="itemsPerPage" search :data="videos">

      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

        <div class="flex flex-wrap-reverse items-center">

          <!-- ACTION - DROPDOWN -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mr-4 mb-4">

            <div class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32">
              <span class="mr-2">Действия</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Удалить</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

          <!-- ADD NEW -->
          <div class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary" @click="addNewVideo">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">Добавить новое видео</span>
          </div>
        </div>


        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
          <vs-dropdown-menu>

            <vs-dropdown-item @click="itemsPerPage=4">
              <span>4</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage=10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage=15">
              <span>15</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage=20">
              <span>20</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th>Обложка</vs-th>
        <vs-th sort-key="name">Заголовок</vs-th>
        <vs-th sort-key="category">Категория</vs-th>
        <vs-th sort-key="order_status">Статус</vs-th>
        <vs-th>Действия</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td class="img-container">
              <img :src="$apiUrl+tr.img" class="product-img" />
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">{{ tr.title }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.category.title }}</p>
            </vs-td>

            <vs-td>
              <vs-dropdown>
                <a class="flex items-center" href="#">
                  <vs-chip :color="getOrderStatusColor(tr.published)" class="product-order-status">{{ tr.published ? 'Опубликовано':'Не опубликовано' }}</vs-chip>
                </a>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="togglePublish(tr.id)">
                    {{ tr.published ? 'Изять из публикации':'Опубликовать' }}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <!-- <vx-tooltip text="Загрузить видео"> -->
                <feather-icon icon="VideoIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" class="mt-4" @click.stop="openPopup(tr.id, tr.img)" />
              <!-- </vx-tooltip> -->
              <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" class="ml-2" @click.stop="editData(tr)" />
              <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2" @click.stop="openConfirm(tr.id)" />
            </vs-td>

          </vs-tr>
        </tbody> 
      </template>
    </vs-table>
    <vs-popup :fullscreen="false"  class="holamundo" title="Загрузите видео" :active.sync="popupActive">
      <vs-checkbox class="ml-2" v-model="check">Локальная загрузка</vs-checkbox>
      <div v-if="check">
        <vx-card class="overflow-hidden">
          <template slot="no-body">
            <video-player 
                v-if="video" 
                ref="player" 
                class="media-video-player card-video" 
                :options="playerOptions"
                :playsinline="true"
                @ready="log" />
          </template>
        </vx-card>
        <div class="video mt-4">
          <input type="file" class="hidden" ref="uploadVideo" @change="updateVideo" accept="video/*">
            <vs-button type="flat" @click="$refs.uploadVideo.click()">Выберите видео</vs-button>
            <vs-button color="success" v-if="video" class="mr-6 ml-3" @click="uploadVideo">Сохранить</vs-button>
        </div>
      </div>
      <div v-else>
        <div class="mt-4 ml-2">
          <vs-input icon-pack="feather"
            class="w-full" 
            icon="icon-edit-2" 
            icon-after 
            placeholder="Ссылка с ютуба" 
            v-model="youtubeLink" />
            <vs-button color="success" :disabled="!youtubeLink" class="mt-4" @click="uploadVideo">Сохранить</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import VideoSidebar from '../../components/video/VideoSidebar'
import { mapGetters } from 'vuex'
import { videoPlayer } from 'vue-video-player'

export default {
  components: {
    VideoSidebar,
    videoPlayer
  },
  data () {
    return {
      flag: false,
      selected: [],
      publishedId:null,
      itemsPerPage: 4,
      isMounted: false,
      addNewDataSidebar: false,
      sidebarData: {},
      deletedId:null,
      popupActive:false,
      videoId:null,
      video: null,
      images:[],
      check:false,
      youtubeLink:"",
      playerOptions: {
        height:"300px",
        width:"200px",
          muted: false,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: ""
          }],
        }
    }
  },
  computed: {
    currentPage () {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    ...mapGetters({
      videos: 'video/getVideos',
      categories: 'trends/getCategories'
    })
  },

  watch:{
    videos(){
      this.flag = true
    }
  },

  methods: {
    addNewVideo () {
      this.sidebarData = {}
      this.toggleDataSidebar(true)
    },
    deleteData () {
      this.$store.dispatch('video/DELETE_VIDEO', this).catch(err => { console.error(err) })
    },
    editData (data) {
      this.sidebarData = data
      this.toggleDataSidebar(true)
    },
    getOrderStatusColor (status) {
      if (status)  {
        return 'success'
      }else{
        return 'danger'
      }
    },
    toggleDataSidebar (val = false) {
      this.addNewDataSidebar = val
    },
    openConfirm(id) {
      this.deletedId = id
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Подтвердите удаления`,
        text: 'Безвозвратное удаление видео.',
        accept: this.deleteData,
        acceptText: "Подтвердить",
        cancelText: "Отменить"
      })
    },
    openPopup(videoId, videoImg){
      this.videoId = videoId
      this.playerOptions.poster = `${this.$apiUrl}/storage/${videoImg}`
      this.popupActive = true
    },
    updateVideo (input) {
      if (input.target.files && input.target.files[0]) {
        this.video = input.target.files[0]
        const reader = new FileReader()
        reader.onload = e => {
            this.playerOptions.sources[0].src = e.target.result
          }
        reader.readAsDataURL(input.target.files[0])
      }
    },
    uploadVideo(){
      const fromYoutube = this.check ? 0:1
      let formData = new FormData()
      formData.append('video', this.video)
      formData.append('fromYoutube', fromYoutube)
      formData.append('youtubeLink', this.youtubeLink)
      this.$http.post(`video/upload_video/${this.videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.popupActive = false
      })
    },
    togglePublish(videoId){
      this.publishedId = videoId
      this.$store.dispatch('video/TOGGLE_PUBLISH', this).catch(err => { console.error(err) })
    },
  },
  mounted () {
    this.isMounted = true
    this.$store.dispatch('trends/GET_CATEGORY', this).catch(err => { console.error(err) })
    this.$store.dispatch('video/GET_VIDEOS', this).catch(err => { console.error(err) })    
  }
}
</script>

<style lang="scss">
.img-container{
    width: 100px;
    height: 80px;
}
  .product-img{
    width: 100%;
    height: 100%;
  }
.video{
  padding-left: 147px;
}
</style>