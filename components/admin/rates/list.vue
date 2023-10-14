<template>
<div class="table-container">
    <b-table striped hover responsive :items="list" :fields="fields" :busy="isLoading">
    </b-table>
</div>
</template>

<script>
export default {
    name: "list.vue",
    props: {
        list: Array,
        isLoading: Boolean,
    },
    data() {
        return {
            fields: [
                {
                    key: 'date',
                    label: this.$t('Rates.Date'),
                },
                {
                    key: 'time',
                    label: this.$t('Rates.Time'),
                },
                {
                    key: 'sellUsd',
                    label: this.$t('Rates.Usd'),
                },
                {
                    key: 'sellEur',
                    label: this.$t('Rates.Eur'),
                },
                {
                    key: 'sellRub',
                    label: this.$t('Rates.Rub'),
                },
            ]
        }
    }
}
</script>
