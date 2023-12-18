<script setup lang=ts>
import type { IContract } from "~/types/contract.interface";
import { IDiscountItem } from "~/types/common";
import { useCustomerStore } from "~/store/customers";
import DiscountList from '../discounts/List.vue'
import CreateDiscountTab from '../discounts/Modal.vue'
import * as yup from 'yup'
import { SystemName } from "~/types/region.interface";

const props = defineProps<{
    contract: IContract;
}>()

const isLoading = ref<boolean>(true);
const discountList = ref<IDiscountItem[]>([])
const customerStore = useCustomerStore();
const isShowModal = ref(false);

watchEffect(async () => {
    if (props.contract?.id) {
        const list = await customerStore.getDiscounts(props.contract.customerId, props.contract.id)
        discountList.value = list;
        isLoading.value = false;
    }
})

const showNewContractModal = () => {
    isShowModal.value = true;
}

const { handleSubmit, resetForm } = useForm({
    validationSchema: yup.object().shape({
        amount: yup.string().required(),
        discount: yup.string().required(),
        period: yup.string().required(),
        system: yup.string().oneOf(Object.values(SystemName))
    })
})

const processForm = handleSubmit(async (values) => {
    try {
        const item = await customerStore.addDiscount(props.contract.id, values)
        discountList.push(item)
    } catch (e: any) {
        useNuxtApp().$toast.error(e.message);
        console.error(e);
    }
})

useListen('delete:discount', (id) => discountList.value = discountList.value.filter(i => i.id !== id))
</script>
<template>
    <div>
        <div v-if="isLoading" class="d-flex mb-1 justify-content-center">
            <b-spinner />
        </div>
        <template v-else>
            <h3 v-if="discountList?.length === 0">
                Нет накопительных скидок
            </h3>
            <DiscountList :list="discountList" :customer-id="contract.customerId" />
        </template>
        <b-button class="discounts-tab-add-btn" variant="danger" @click="showNewContractModal">
            Добавить скидку
        </b-button>

        <b-modal v-model="isShowModal" @cancel="resetForm" @ok="processForm" ok-variant="danger" cancel-variant="dark"
            title="Создание накопительной скидки">
            <CreateDiscountTab />
        </b-modal>
    </div>
</template>
<style>
.discounts-tab-add-btn {
    width: 100%;
    height: 59px;
    margin-top: 1rem;
}
</style>