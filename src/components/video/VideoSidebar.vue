<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>{{ Object.entries(this.data).length === 0 ? "Добавить новое" : "Изменить" }} Видео</h4>
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <!-- Product Image -->
        <template v-if="dataImg">

          <!-- Image Container -->
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <img v-if="imgUrl" :src="imgUrl" alt="img" class="responsive">
            <img v-else :src="dataImg" alt="img" class="responsive">
          </div>

          <!-- Image upload Buttons -->
          <div class="modify-img flex justify-between mt-5">
            <input type="file" class="hidden" ref="updateImgInput" @change="updateCurrImg" accept="image/*">
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">Выбрать другую</vs-button>
            <vs-button type="flat" color="#999" @click="dataImg = null">Удалить</vs-button>
          </div>
        </template>

        <!-- CATEGORY -->
        <vs-select v-model="category" autocomplete label="Категория" class="mt-5 w-full" name="item-category" v-validate="'required'">
          <div v-for="item in categories" :key="item.id">
            <vs-select-item :value="item.id" :text="item.title" />
          </div>
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('item-category')">{{ errors.first('item-category') }}</span>

        <!-- NAME -->
        <vs-input label="Заголовок" v-model="title" class="mt-5 w-full" name="item-name" v-validate="'required'" />
        <span class="text-danger text-sm" v-show="errors.has('item-name')">{{ errors.first('item-name') }}</span>

        <vs-textarea  class="mt-5 w-full" label="Описание" v-model="description" />

        

        <!-- Upload -->
        <!-- <vs-upload text="Upload Image" class="img-upload" ref="fileUpload" /> -->

        <div class="upload-img mt-5" v-if="!dataImg">
          <input type="file" class="hidden" ref="uploadImgInput" @change="updateCurrImg" accept="image/*">
          <vs-button @click="$refs.uploadImgInput.click()">Выберите картинку для обложки</vs-button>
        </div>

      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">Сохранить</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Отменить</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {}
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    VuePerfectScrollbar
  },
  data () {
    return {
      dataId: null,
      title: '',
      category: null,
      dataImg: null,
      imgUrl:null,
      description:null,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: .60
      }
    }
  },
  watch: {
    isSidebarActive (val) {
      if (!val) return
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        this.$validator.reset()
      } else {
        const { id, category_id, img, title, description } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.category = category_id
        this.dataImg = `${this.$apiUrl}/${img}`
        this.title = title
        this.description = description
      }
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
          this.$validator.reset()
          this.initValues()
        }
      }
    },
    isFormValid () {
      return !this.errors.any() && this.title && this.category && this.dataImg
    },
    scrollbarTag () { return this.$store.getters.scrollbarTag }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.dataId = null
      this.title = ''
      this.category = null
      this.dataImg = null
      this.imgUrl = null
      this.description = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.dataId) {
            this.$store.dispatch('video/UPDATE_VIDEO', this).catch(err => { console.error(err) })
          } else {
            this.$store.dispatch('video/CREATE_VIDEO', this).catch(err => { console.error(err) })
          }

          this.$emit('closeSidebar')
          this.initValues()
        }
      })
    },
    updateCurrImg (input) {
      if (input.target.files && input.target.files[0]) {
        this.dataImg =input.target.files[0]
        const reader = new FileReader()
        reader.onload = e => {
            this.imgUrl = e.target.result
          }
          reader.readAsDataURL(input.target.files[0])
        }
    },
  },

  mounted(){    
  }
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
      overflow-y: auto;
    }
}
</style>
