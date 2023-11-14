<script setup lang="ts">
import type { INavLink } from '~/types/common';

defineProps<{
    sidebarCollapsed: boolean;
    navLinks: INavLink[]
    showLinkText: boolean;
}>()

defineEmits<{
    (ev: 'toggle', payload: void): void;
}>()
</script>
<template>
     <b-navbar
                class="my-sidebar p-0"
                :class="sidebarCollapsed && 'sidebar-collapsed'"
                type="dark"
                variant="primary"
                :container="false"
                @click.native="$emit('toggle')"
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
</template>