<template>
  <v-container class="lists">
    <v-form @submit.prevent="onCreateList">
      <v-text-field
        v-model="listName"
        label="Новый список"
        required
      ></v-text-field>
      <v-btn
        block
        type="submit"
        color="primary"
        :disabled="!listName"
        v-text="'Добавить список'"
      ></v-btn>
    </v-form>
    <v-list class="pt-5 overflow-y-auto" style="max-height: 400px">
      <router-link
        @click.prevent
        v-for="(item, key) in lists"
        :key="key"
        :to="routingLists(item)"
      >
        <v-list-item
          link
          @click="!updatingListId && onSelectList(item.id)"
          :class="{ 'v-list-item--active': selectedListId === item.id }"
        >
          <v-text-field v-if="updatingListId === item.id"
            @click.stop.prevent
            v-model="updatingListName"
          ></v-text-field>
          <v-list-item-content v-else>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>        
          <v-list-item-icon
            @click.stop.prevent="updatingListId === item.id ? onUpdateList(item) : onSelectListToUpdate(item)"
          >
            <v-icon v-text="updatingListId === item.id ? 'mdi-check' : 'mdi-pencil'"></v-icon>
          </v-list-item-icon>
          <v-list-item-icon 
            @click.stop.prevent="onDeleteList(item.id)"
          >
            <v-icon v-text="'mdi-delete'"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </router-link>
    </v-list>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Lists',
  data: () => ({
    listName: '',
    updatingListName: '',
    updatingListId: null,
  }),
  async mounted () {
    await this.onSelectList(this.$route.params.id || '')
    await this.getLists()
  },
  computed: {
    ...mapState('lists', [
      'lists',
      'selectedListId'
    ])
  },
  methods: {
    ...mapActions('lists', [
      'getLists',
      'selectList',
      'createList',
      'deleteList',
      'updateList',
    ]),
    routingLists (list) {
      if (this.selectedListId === list.id) {
        return { name: 'List', params: { id: list.id }}
      } else {
        return { name: 'Home' }
      }
    },
    onSelectListToUpdate ({ id, name }) {
      this.updatingListId = id
      this.updatingListName = name
    },
    onSelectList (itemId) {
      this.selectList(itemId)
    },
    onCreateList () {
      this.createList(this.listName)
      this.listName = ''
    },
    onUpdateList () {
      let { updatingListName, updatingListId } = this
      this.updateList({ updatingListName, updatingListId })
      this.updatingListId = null
    },
    onDeleteList (itemId) {
      if (itemId === this.selectedListId) {
        this.$router.push({ name: 'Home' })
        this.onSelectList(null)
      }
      this.deleteList(itemId)
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>