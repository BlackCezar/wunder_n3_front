import { defineStore } from "pinia";

import type {
    IRegion,
    IRegionSettings,
    IRegionSystemSettings,
    ISystem,
} from "~/types/region.interface";

import { useNuxtApp } from "#imports";
import { useLogger } from "vue-logger-plugin";

interface IRegionsState {
    region: IRegion | null;
    settings: IRegionSettings | null;
    systems: ISystem[];
    regions: IRegion[];
    systemSettings: IRegionSystemSettings[];
}

export const useRegionStore = defineStore("region", {
    state: (): IRegionsState => ({
        region: null,
        settings: null,
        systems: [],
        regions: [],
        systemSettings: [],
    }),

    getters: {
        regionName: (state) => state.region?.name,
        regionCurrency: (state) => state.region?.currency,
        globalSettings: (state): IRegionSettings | null => state.settings,
        globalSystemSettings: (state): IRegionSystemSettings[] =>
            state.systemSettings,
    },
    actions: {
        async loadGlobalSettings() {
            const { apiClient } = useClient();
            const log = useLogger();
            log.info("started");

            try {
                this.settings = await apiClient.get("/settings/global");
                if (this.settings?.region) this.region = this.settings.region;
                if (process.client) log.info("Loaded settings", this.settings);
                this.systemSettings = await apiClient.get(
                    "/settings/global/systems",
                );
                if (process.client)
                    log.info("Loaded systemSettings", this.systemSettings);

                return this.settings;
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async loadSystems() {
            try {
                const { apiClient } = useClient();
                this.systems = await apiClient.get("/systems");
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async loadRegions() {
            try {
                const { apiClient } = useClient();
                this.regions = await apiClient.get("/regions/settings");
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async create(values: any) {
            try {
                const { apiClient } = useClient();
                const region = await apiClient.post("/regions", values);
                this.regions.push(region);
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async update(values: any) {
            try {
                const { apiClient } = useClient();
                console.log(values);
                const region = await apiClient.put(
                    "/regions/settings/update",
                    values,
                );

                this.regions.map((r) => {
                    return r.id === region.id ? region : r;
                });
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async generatePFToken() {
            try {
                const { apiClient } = useClient();
                return await apiClient.post("/plan-fix/generate-token");
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async deleteRegion(id: number) {
            try {
                const { apiClient } = useClient();
                await apiClient.delete("/regions/" + id);
                this.regions = this.regions.filter((item) => item.id !== id);
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },

        async removeSystemLine({
            systemSettingsId,
            lineId,
        }: {
            systemSettingsId: number;
            lineId: number;
        }) {
            if (lineId) {
                const { apiClient } = useClient();
                await apiClient.delete(`/regions/settings-lines`, {
                    query: {
                        id: lineId,
                        isCustomer: false,
                    },
                });
            }
            const systemSetting = this.systemSettings.find(
                (r) => r.id === systemSettingsId,
            );
            if (systemSetting)
                systemSetting.lines = systemSetting.lines.filter(
                    (item) => item.id !== lineId,
                );
        },
    },
});
