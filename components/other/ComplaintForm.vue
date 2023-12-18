<script setup lang=ts>
import * as yup from 'yup'

const isModalOpen = ref(false);

const { handleSubmit, resetForm } = useForm({
    validationSchema: yup.object().shape({
        theme: yup.string().required(),
        content: yup.string().required()
    })
})

const processForm = handleSubmit(async (values) => {
    const { apiClient } = useClient()

    try {
        await apiClient.post('/regions/complaint', values)
        useNuxtApp().$toast.success('Мы получили ваше обращение! Спасибо.')
    } catch (err) {
        useNuxtApp().$toast.error('При отправке формы возникли проблемы, попробуйте еще раз');
    }
})

</script>   
<template>
    <div class="complaint-form">
        <button @click="isModalOpen = true" class="complaint-form-button">
            <IBiExclamation class="complaint-form-button-icon" />
        </button>
        <b-modal v-model="isModalOpen" @cancel="resetForm" @ok="processForm" ok-variant="danger" cancel-variant="dark"
            ok-title="Отправить форму" cancel-title="Отменить" title="Пожаловаться">
            <form class="complaint-form-content">
                <UiFormInput label="Тема" name="theme" />
                <UiFormInput type="textarea" label="Сообщение" name="content" />
            </form>
        </b-modal>
    </div>
</template>
<style>
.complaint-form-button {
    pointer-events: all;
    width: 50px;
    cursor: pointer !important;
    height: 50px;
    background-color: var(--white);
    border: 2px solid var(--white);
    border-radius: 50%;
    color: var(--accent);
    transition: background 0.3 ease-out;
}

.complaint-form-button:hover {
    background-color: var(--borderGray2);
}

.complaint-form-button-icon {
    width: 100%;
    height: 100%;
}

.complaint-form-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>