<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? "Добавить новый" : "Редактировать" }} Пост</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <!-- Product Image -->
        <template v-if="dataImg">
          <!-- Image Container -->
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <img v-if="imgUrl" :src="imgUrl" alt="img" class="responsive" />
            <img v-else :src="dataImg" alt="img" class="responsive" />
          </div>

          <!-- Image upload Buttons -->
          <div class="modify-img flex justify-between mt-5">
            <input
              type="file"
              class="hidden"
              ref="updateImgInput"
              @change="updateCurrImg"
              accept="image/*"
            />
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">Выбрать другую</vs-button>
            <vs-button type="flat" color="#999" @click="dataImg = null">Удалить</vs-button>
          </div>
        </template>

        <!-- NAME -->
        <vs-input label="Название" v-model="dataName" class="mt-5 w-full" name="item-name" />

        <div class="upload-img mt-5" v-if="!dataImg">
          <input
            type="file"
            class="hidden"
            ref="uploadImgInput"
            @change="updateCurrImg"
            accept="image/*"
          />
          <vs-button @click="$refs.uploadImgInput.click()">Выберите картинку</vs-button>
        </div>
      </div>
      <div class="flex flex-wrap items-center p-6">
        <vs-button class="mr-6" @click="submitData">Сохранить</vs-button>
        <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Отменить</vs-button>
      </div>
    </component>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      dataImg: null,
      imgUrl: null,
      dataId: null,
      dataName: "",
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
      },
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    initValues() {
      if (this.data.id) return;
      this.dataId = null;
      this.dataName = "";
    },
    submitData() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.data !== null && this.data.id >= 0) {
            this.$store
              .dispatch("post/UPDATE_POST", this)
              .catch((err) => {
                console.error(err);
              });
          } else {
            this.$store
              .dispatch("post/CREATE_POST", this)
              .catch((err) => {
                console.error(err);
              });
          }
          this.$emit("closeSidebar");
          this.initValues();
        }
      });
    },
    updateCurrImg(input) {
      if (input.target.files && input.target.files[0]) {
        this.dataImg = input.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imgUrl = e.target.result;
        };
        reader.readAsDataURL(input.target.files[0]);
      }
    },
  },

  watch: {
    isSidebarActive(val) {
      if (!val) return;
      if (Object.entries(this.data).length === 0) {
        this.initValues();
        this.$validator.reset();
      } else {
        const { id, img, title } = JSON.parse(JSON.stringify(this.data));
        this.dataId = id;
        this.dataName = title;
        this.dataImg = `${this.$apiUrl+img}`;
      }
    },
  },
};
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
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
