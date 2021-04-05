<template>
  <v-container class="goods elevation-2">
    <v-row>
      <v-col cols="3">
        <v-text-field
          :value="searchText"
          @input="onSearchGoodsItem($event)">
          <v-icon
            slot="prepend"
            v-text="'mdi-magnify'"
          ></v-icon>
        </v-text-field>
      </v-col>
      <v-col cols="3">
        <v-select
          :value="searchHeader"
          @change="onUpdateSearchHeader($event)"
          :items="headers"
          item-text="name"
          item-value="value"
          label="Поиск по свойству"
        ></v-select>
      </v-col>
      <v-col cols="2">
      </v-col>
      <v-col cols="4">
        <v-btn
          block
          @click="onUpdateSortedByName(!sortedByName)"
        >{{sortBtnText}}</v-btn>
      </v-col>
    </v-row>
    <template v-if="selectedListId">
      <v-simple-table fixed-header height="400px">
        <thead>
          <tr>
            <th 
              v-for="(item, key) in headers"
              :key="key"
              class="text-left"
              v-text="item.name"
            ></th>
            <th :key="headers.length"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, key) in goods"
            :key="key"
            class="goods-item"
            :class="{ 'goods-item--non_active': item.bought }"
            @click="!updatingGoodsItemId && updateGoodsItemBought(item)"
          >
            <td>
              <v-text-field v-if="updatingGoodsItemId === item.id"
                @click.stop
                v-model="updatingGoodsItemName"
              ></v-text-field>
              <span v-else v-text="item.name"></span>
            </td>
            <td width="150px">
              <v-text-field v-if="updatingGoodsItemId === item.id"
                @click.stop
                v-model="updatingGoodsItemCount"
                type="number"
                min="1"
              ></v-text-field>
              <span v-else v-text="item.count"></span>
            </td>
            <td width="150px">
              <v-select v-if="updatingGoodsItemId === item.id"
                @click.stop
                v-model="updatingGoodsItemUnit"
                :items="units"
                item-text="name"
                item-value="value"
              ></v-select>
              <span v-else v-text="units.find(it => it.value === item.unit).name"></span>
            </td>
            <td width="150px">
              <v-list-item-icon
                v-if="!item.bought"
                @click.stop="updatingGoodsItemId === item.id ? onUpdateGoodsItem(item) : onSelectItemToUpdate(item)"
              >
                <v-icon v-text="updatingGoodsItemId === item.id ? 'mdi-check' : 'mdi-pencil'"></v-icon>
              </v-list-item-icon>
              <v-list-item-icon
                @click.stop="deleteGoodsItem(item.id)"
              >
                <v-icon v-text="'mdi-delete'"></v-icon>
              </v-list-item-icon>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-form @submit.prevent="onCreateGoodsItem">
        <v-row align="center">
          <v-col cols="4">
            <v-text-field
              v-model.trim="goodsItemName"
              label="Наименование"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="Кол-во"
              v-model.trim="goodsItemCount"
              type="number"
              min="1"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              label="Ед. измер."
              v-model="goodsItemUnit"
              :items="units"
              item-text="name"
              item-value="value"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-btn
              block
              color="primary"
              type="submit"
              :disabled="!goodsItemName"
              v-text="'Добавить'"
            ></v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Goods',
  data: () => ({
    goodsItemName: '',
    goodsItemCount: 1,
    goodsItemUnit: 0,
    updatingGoodsItemId: null,
    updatingGoodsItemName: '',
    updatingGoodsItemCount: 1,
    updatingGoodsItemUnit: 0,
  }),
  mounted () {
    this.onGetGoods()
    this.onSearchGoodsItem(localStorage.getItem('searchText') || this.searchText)
    this.onUpdateSortedByName(JSON.parse(localStorage.getItem('sortedByName')) || this.sortedByName)
    this.onUpdateSearchHeader(localStorage.getItem('searchHeader') || this.searchHeader)
  },
  computed: {
    ...mapGetters('goods', [
      'goods',
    ]),
    ...mapState('goods', [
      'headers',
      'units',
      'searchHeader',
      'searchText',
      'sortedByName'
    ]),
    ...mapState('lists', [
      'selectedListId',
    ]),
    sortBtnText () {
      return this.sortedByName ? 'По новым' : 'По имени'
    },
  },
  methods: {
    ...mapActions('goods', [
      'getGoods',
      'createGoodsItem',
      'deleteGoodsItem',
      'updateGoodsItem',
      'updateGoodsItemBought',
      'updateSearch',
      'updateSearchHeader',
      'updateSortedByName',
    ]),
    onCreateGoodsItem () {
      let { goodsItemName, goodsItemCount, goodsItemUnit } = this
      this.createGoodsItem({ goodsItemName, goodsItemCount, goodsItemUnit })
      this.goodsItemName = ''
      this.goodsItemCount = 1
    },
    onUpdateGoodsItem () {
      let { updatingGoodsItemName, updatingGoodsItemCount, updatingGoodsItemUnit, updatingGoodsItemId } = this
      this.updateGoodsItem({ updatingGoodsItemName, updatingGoodsItemCount, updatingGoodsItemUnit, updatingGoodsItemId })
      this.updatingGoodsItemId = null
    },
    onSelectItemToUpdate ({ id, name, count, unit }) {
      this.updatingGoodsItemId = id
      this.updatingGoodsItemName = name
      this.updatingGoodsItemCount = count
      this.updatingGoodsItemUnit = unit
    },
    onSearchGoodsItem (value) {
      this.updateSearch(value)
    },
    onUpdateSearchHeader (value) {
      this.updateSearchHeader(value)
    },
    onUpdateSortedByName (value) {
      this.updateSortedByName(value)
    },
    onGetGoods () {
      this.getGoods()
    }
  }
}
</script>

<style>
.goods-item {
  cursor: pointer;
  position: relative;
  padding-right: 120px;
}
.goods-item--non_active {
  opacity: .3;
}
</style>
