<template>
  <el-select
    ref="draggableSelect"
    v-model="selectVal"
    v-bind="$attrs"
    class="draggable-select"
    multiple
  >
    <slot />
  </el-select>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import Sortable from 'sortablejs'
import { ElSelect } from 'element-plus'

export default defineComponent({
  name: 'DraggableSelect',
  props: {
    modelValue: {
      type: Array as () => string[],
      required: true
    }
  },
  setup(props, { emit }) {
    const draggableSelect = ref<typeof ElSelect | null>(null)
    const sortable = ref<Sortable | null>(null)

    const selectVal = ref([...props.modelValue])

    const handleSelectChange = (value: string[]) => {
      emit('update:modelValue', [...value])
    }

    const setSort = () => {
      nextTick(() => {
        if (draggableSelect.value) {
          const el = draggableSelect.value.$el.querySelector('.el-select__selection') as HTMLElement

          if (el) {
            sortable.value = Sortable.create(el, {
              ghostClass: 'sortable-ghost',
              animation: 150,
              onEnd: (evt) => {
                if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                  const movedItem = selectVal.value.splice(evt.oldIndex, 1)[0]
                  selectVal.value.splice(evt.newIndex, 0, movedItem)
                  handleSelectChange(selectVal.value)
                }
              }
            })
          }
        }
      })
    }

    onMounted(() => {
      setSort()
    })

    return {
      draggableSelect,
      selectVal
    }
  }
})
</script>

<style lang="scss">
.draggable-select .sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.draggable-select .el-tag {
  cursor: pointer;
}
</style>
