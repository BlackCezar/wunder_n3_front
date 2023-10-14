<template>
    <div><h1>hello</h1></div>
    <div class="page knowledge-page">
        <div class="page-paddings">
            <h1 class="page-title">
                <span class="ui-color-gray">База знаний:</span> управление
                разделом
            </h1>
        </div>

        <div class="row">
            <div class="col-md-9">
                <div class="ui-block">
                    <div class="row">
                        <div class="col-sm-4 col-xs-6">
                            <nuxt-link
                                to="/knowledge/admin/categories"
                                class="knowledge-manage"
                            >
                                <div class="knowledge-manage-icon">
                                    <IBiListOl />
                                </div>
                                <span class="knowledge-manage-name"
                                    >Создание и управление категориями
                                    материалов</span
                                >
                            </nuxt-link>
                        </div>

                        <div class="col-sm-4 col-xs-6">
                            <nuxt-link
                                to="/knowledge/admin/posts/create"
                                class="knowledge-manage"
                            >
                                <div class="knowledge-manage-icon">
                                    <IBiPencilSquare />
                                </div>
                                <span class="knowledge-manage-name"
                                    >Создание материалов</span
                                >
                            </nuxt-link>
                        </div>
                    </div>

                    <h3 style="margin-bottom: 25px">Полезная информация</h3>

                    <div class="row">
                        <div class="col-sm-8">
                            <b-alert show variant="secondary"
                                >Для создания материалов необходимо наличие хотя
                                бы одной категории (раздела): привязка материала
                                к категории обязательна</b-alert
                            >
                            <b-alert show variant="secondary"
                                >Редактировать и удалять материалы можно
                                непосредственно из их карточек</b-alert
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--cols-->
    </div>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
.knowledge-manage {
    display: block;
    padding: 20px 20px 20px 20px;
    background-color: #f3f3f3;
    text-decoration: none;
    font-size: 0;
    line-height: 1.25;
    font-weight: 600;
    min-height: calc(100% - 30px);
    margin-bottom: 30px;
}
.knowledge-manage-icon {
    display: inline-block;
    vertical-align: middle;
    width: 48px;
    height: 48px;
    font-size: 48px;
    line-height: 48px;
    margin-right: 20px;
    color: var(--accent);
}
.knowledge-manage-name {
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    width: calc(100% - 68px);
}
</style>
