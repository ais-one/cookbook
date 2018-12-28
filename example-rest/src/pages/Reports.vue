<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.calories }}</td>
      <td class="text-xs-right">{{ props.item.fat }}</td>
      <td class="text-xs-right">{{ props.item.carbs }}</td>
      <td class="text-xs-right">{{ props.item.protein }}</td>
      <td class="text-xs-right">{{ props.item.iron }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' }
      ],
      desserts: [
        { value: false, name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24 },
        { value: false, name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37 },
        { value: false, name: 'Eclair', calories: 262, fat: 16.0, carbs: 23 },
        { value: false, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67 },
        { value: false, name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49 },
        { value: false, name: 'Jelly bean', calories: 375, fat: 0.0, carbs: 94 },
        { value: false, name: 'Lollipop', calories: 392, fat: 0.2, carbs: 98 },
        { value: false, name: 'Honeycomb', calories: 408, fat: 3.2, carbs: 87 }
      ]
    }
  }
}
</script>
