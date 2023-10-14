<script setup lang="ts">
import { INavLink } from "~/types/common";
import { useRatesStore } from "~/store/rates";
import { storeToRefs } from "pinia";
import { useRegionStore } from "~/store/regions";
import { ICustomerRole } from "~/types/user.interface";
import { useAuthStore } from "~/store/auth";

defineProps<{
    navLinks: INavLink[];
}>();
const authStore = useAuthStore();
const ratesStore = useRatesStore();
const regionStore = useRegionStore();
const { region } = storeToRefs(regionStore);
const { rates } = storeToRefs(ratesStore);
const {user} = storeToRefs(authStore)
</script>

<template>
    <b-navbar class="my-header" toggleable="lg" type="light" :container="false">
        <b-navbar-toggle target="nav-collapse" />
        <b-navbar-nav class="rate">
            <span class="currency-symbol">$</span>
            <span class="currency-value"
                >{{ rates.sellUSD }} {{ region ? region.currency : "" }}</span
            >
            <span class="currency-symbol">₽</span>
            <span class="currency-value"
                >{{ rates.sellRUB }} {{ region ? region.currency : "" }}</span
            >
            <span class="currency-symbol">€</span>
            <span class="currency-value"
                >{{ rates.sellEUR }} {{ region ? region.currency : "" }}</span
            >
        </b-navbar-nav>
        <b-collapse id="nav-collapse" is-nav="true">
            <b-navbar-nav
                class="when-open"
                v-for="navLink in navLinks"
                :key="navLink.to"
            >
                <b-nav-item :to="navLink.to">{{ navLink.linkText }}</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ms-auto user-info">
                <b-nav-text
                    right
                    v-if="user && user.role === ICustomerRole.CUSTOMER"
                >
                    <div
                        class="user-name"
                        v-text="user?.customer?.contactName"
                    ></div>
                    <div
                        class="user-details"
                        v-text="user?.customer?.companyName"
                    ></div>
                </b-nav-text>
                <b-nav-text right v-else-if="user && user.role === `ADMIN`">
                    <div class="user-name">Super Admin</div>
                    <div class="user-details">{{ $t("header.Admin") }}</div>
                </b-nav-text>
                <b-nav-text id="user-icon" right class="user-icon">
                    <img src="/imgs/user_47.png" alt="user" />
                </b-nav-text>
                <b-tooltip target="user-icon">
                    <b-button variant="primary" @click="authStore.logout()">{{
                        $t("header.SignOut")
                    }}</b-button>
                </b-tooltip>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<style lang="css">
@media screen and (max-width: 768px) {
    .navbar-collapse {
        padding: 0.5rem 0;
    }
    .navbar-collapse > ul.navbar-nav.when-open a {
        text-align: center;
    }
}

.navbar-collapse > .when-open {
    display: none !important;
}

.navbar-collapse.show > .when-open {
    display: flex !important;
}

.my-header {
    min-height: 7.37em;
    padding-left: 4.18em;
    padding-right: 4.68em;
}
@media screen and (max-width: 768px) {
    .my-header {
        padding: 0.5rem 20px;
        min-height: 90px;
    }
    .my-header .nav-item {
        font-size: 18px;
        font-weight: bold;
        text-align: left;
    }
}

.user-icon {
    width: 68px;
    height: 68px;
    background-image: linear-gradient(37deg, #af0518 5%, #ff1313 94%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-icon:hover {
    background-image: linear-gradient(37deg, #811e2c 5%, #f11111 94%);
}

.user-info {
    font-size: 20px;
    line-height: 1.2;
    text-align: right;
}
@media screen and (max-width: 768px) {
    .user-info {
        display: grid;
        grid-template-columns: 1fr 68px;
    }
}

.user-info .navbar-text {
    margin-right: 1.15em;
}

.user-info .user-icon {
    margin-right: 0;
}

.user-info .user-name {
    font-weight: 500;
    color: var(--paragraphColor);
}

.user-info .user-details {
    font-weight: 400;
    color: #858585;
}

.rate {
    align-items: center;
}

.currency-symbol {
    margin-left: 55px;
    margin-right: 11px;
    font-size: 44px;
    font-weight: 400;
    color: #e4002b;
}

.currency-symbol:first-child {
    margin-left: 0;
}

.currency-value {
    color: var(--paragraphColor);
    font-size: 25px;
}
</style>
