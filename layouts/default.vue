<script setup lang="ts">
import { storeToRefs } from "pinia";
import { setLocale } from "yup";
import TheHeader from "~/components/common/header/TheHeader.vue";
import FloatBtns from "~/components/other/FloatBtns.vue";
import { useAuthStore } from "~/store/auth";
import { useContractStore } from "~/store/contracts";
import { useRatesStore } from "~/store/rates";
import { useRegionStore } from "~/store/regions";
import type { INavLink } from "~/types/common";
import { ICustomerRole } from "~/types/user.interface";
import CardList from "~icons/bi/card-list";
import CurrencyExchange from "~icons/bi/currency-exchange";
import FileEarmarkSpreadsheet from "~icons/bi/file-earmark-spreadsheet";
import FileEarmarkText from "~icons/bi/file-earmark-text";
import GearIcon from "~icons/bi/gear";
import PersonCircle from "~icons/bi/person-circle";
import PersonPlus from "~icons/bi/person-plus";
import QuestionCircle from "~icons/bi/question-circle";
import TableIcon from "~icons/bi/table";

const sidebarCollapsed = ref<boolean>(true);
const showLinkText = ref<boolean>(true);
const ratesStore = useRatesStore();
const contractStore = useContractStore();
const regionStore = useRegionStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { t } = useI18n();

const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    showLinkText.value = !showLinkText.value;
};

const { data: userProfile } = await useAsyncData("user", () =>
    authStore.getProfile(),
);
authStore.setUser(userProfile.value);

const navLinks = computed<INavLink[]>(() => {
    if (user.value?.role === ICustomerRole.ADMIN) {
        return [
            {
                to: "/admin",
                icon: PersonCircle,
                linkText: t("Navigation.Clients"),
            },
            {
                to: "/admin/settings",
                icon: GearIcon,
                linkText: t("Navigation.Settings"),
            },
            {
                to: "/admin/customer-candidates",
                icon: PersonPlus,
                linkText: t("Navigation.customerCandidates"),
            },
            {
                to: "/admin/knowledge",
                icon: QuestionCircle,
                linkText: t("Navigation.AdminHelp"),
            },
            {
                to: "/knowledge",
                icon: CardList,
                linkText: t("Navigation.Help"),
            },
            {
                to: "/admin/pivot/list",
                icon: TableIcon,
                linkText: t("Navigation.PivotTable"),
            },
            {
                to: "/admin/pivot/report",
                icon: FileEarmarkSpreadsheet,
                linkText: t("Navigation.PivotReport"),
            },
            {
                to: "/admin/rates",
                icon: CurrencyExchange,
                linkText: t("Navigation.Rates"),
            },
        ];
    } else {
        return [
            {
                to: "/accounts",
                icon: PersonCircle,
                linkText: t("Navigation.AccountManagement"),
            },
            {
                to: "/documents",
                icon: FileEarmarkText,
                linkText: t("Navigation.DocumentManagement"),
            },
            {
                to: "/knowledge",
                icon: QuestionCircle,
                linkText: t("Navigation.Help"),
            },
        ];
    }
});
if (user.value?.role === ICustomerRole.CUSTOMER) {
    const { data: contracts } = useAsyncData("contracts", () =>
        contractStore.getCustomerContracts(user.value?.customer?.id),
    );
    authStore.setContracts(contracts.value);
}

ratesStore.loadRates();
regionStore.loadGlobalSettings();
regionStore.loadSystems();

if (!authStore.loggedIn && authStore.tokens?.refresh_token) {
    await authStore.refreshTokens();
    authStore.getProfile();
}

setLocale({
    mixed: {
        required: t("Validation.required"),
        default: t("Validation.InvalidFormat"),
        // notType: t("Validation.InvalidFormat"),
    },
    number: {
        integer: t("Validation.NaN"),
        lessThan: ({ less }) => t("Validation.maxLength", { max: less }),
        moreThan: ({ more }) => t("Validation.minLength", { min: more }),
        max: ({ max }) => t("Validation.Max", { max }),
        min: ({ min }) => t("Validation.Min", { min }),
    },
    string: {
        max: ({ max }) => t("Validation.maxLength", { max }),
        min: ({ min }) => t("Validation.minLength", { min }),
        email: t("Validation.InvalidEmail"),
        url: t("Validation.InvalidSite"),
        length: ({ length }) => t("Validation.Length", { length }),
    },
});
</script>

<template>
    <client-only>
        <b-row
            class="layout-container m-0 p-0"
            :class="{ full: !sidebarCollapsed }"
        >
            <b-navbar
                class="my-sidebar p-0"
                :class="sidebarCollapsed && 'sidebar-collapsed'"
                type="dark"
                variant="primary"
                :container="false"
                @click.native="toggleSidebar()"
            >
                <div class="sidebar-logo bg-danger">
                    <img
                        src="/imgs/short-logo.png"
                        v-if="sidebarCollapsed"
                        alt="logo"
                    />
                    <img src="/imgs/logo_white_13.png" v-else alt="logo" />
                </div>
                <div class="nav-links">
                    <b-navbar-nav
                        vertical
                        v-for="navLink in navLinks"
                        :key="navLink.to"
                    >
                        <b-nav-item
                            :to="navLink.to"
                            class="sidebar-nav-link-container"
                            @click.stop
                        >
                            <div class="sidebar-nav-link p-0">
                                <component
                                    :is="navLink.icon"
                                    style="font-size: 55px; width: 55px"
                                />
                                <div class="ms-3" v-if="!showLinkText">
                                    {{ navLink.linkText }}
                                </div>
                            </div>
                        </b-nav-item>
                    </b-navbar-nav>
                </div>
            </b-navbar>
            <div class="main-container px-0">
                <TheHeader :navLinks="navLinks" />
                <b-overlay
                    id="overlay-background"
                    :show="!sidebarCollapsed"
                    variant="dark"
                    :opacity="0.35"
                    @click.prevent="toggleSidebar"
                >
                    <template #overlay><br /></template>
                    <div class="page-container">
                        <Suspense>
                            <slot />
                        </Suspense>
                        <FloatBtns />
                    </div>
                </b-overlay>
            </div>
        </b-row>
    </client-only>
</template>

<style lang="css">
#__layout {
    height: 100% !important;
    position: relative;
}

.layout-container {
    height: 100% !important;
    display: grid;
    grid-template-columns: 7.37em 1fr;
}

.layout-container.full {
    grid-template-columns: 22.81em 1fr;
}

@media screen and (max-width: 768px) {
    .layout-container {
        grid-template-columns: 1fr;
    }
}

#overlay-background {
    height: calc(100% - 7.37em);
}

.my-sidebar {
    width: 22.81em;
    flex-direction: column !important;
    align-content: flex-start !important;
    align-items: flex-start;
    text-align: left;
    min-height: 100vh;
    /* transition: 0.3s ease; */
    position: static;
    z-index: 1000;
}

.my-sidebar.sidebar-collapsed {
    width: 7.37em;
    align-items: center;
}

.my-sidebar:not(.sidebar-collapsed) .navbar-nav {
    width: 100%;
}

.nav-links {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    line-height: 1.2;
    font-weight: 400;
    padding-left: 1em;
    padding-top: 1em;
}

.my-sidebar.sidebar-collapsed .nav-links {
    padding-left: 0;
}

.sidebar-nav-link-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    vertical-align: middle;
    align-items: center;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
}

.sidebar-nav-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.5);
}

.page-container {
    background: #f2f0f4;
    min-height: calc(100vh - 7.37em);
    height: 100%;
    padding: 3.5rem 1.5rem 1.5rem;
}

@media screen and (max-width: 768px) {
    .page-container {
        padding: 20px;
        min-height: calc(100vh - 90px);
    }
}

.sidebar-logo {
    height: 7.37rem;
    width: 100%;
    display: flex;
    min-height: 7.37rem;
    align-items: center;
    justify-content: center;
    transition: 0.3s ease;
}

.page-header-3 {
    font-size: 36px;
    line-height: 1.2;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--paragraphColor);
    margin: 0 0 2.5rem 2.5rem;
}

@media screen and (max-width: 768px) {
    .page-header-3 {
        margin: 0 0 2rem 0;
        font-size: 24px;
    }
}

.btn .btn-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

@media (max-width: 992px) {
    .main-container {
        width: 100vw;
        margin-left: 0;
    }

    .my-sidebar {
        display: none;
    }
}

@media (min-width: 991px) {
    .with-sidebar-margin {
        margin-left: 15.44em;
    }
}
</style>
