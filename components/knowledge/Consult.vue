<template>
    <div class="knowledge-consult">
        <div class="knowledge-consult-title">Остались вопросы?</div>
        <div class="knowledge-consult-appear">
            Вы можете заказать платную консультацию
        </div>
        <a href="//t.me/wunderdigitalagency" class="ui-btn" target="_blank"
            >Заказать консультацию</a
        >
    </div>
</template>

<script>
export default {
    name: "KnowledgeConsult",
};
</script>

<style lang="css" scoped>
.knowledge-consult {
    border-top: 1px solid var(--lightGray3);
    padding-top: 40px;
    margin-top: 40px;
    font-size: 18px;
}
.knowledge-consult-title {
    font-size: 22px;
    font-weight: 700;
}
.knowledge-consult-appear {
    margin-bottom: 22px;
}
</style>
