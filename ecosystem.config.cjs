module.exports = {
    apps: [
        {
            name: "wunder_n3_front",
            script: "./node_modules/nuxi/bin/nuxi.mjs",
            args: "start",
        },
    ],

    deploy: {
        production: {
            user: "SSH_USERNAME",
            host: "SSH_HOSTMACHINE",
            ref: "origin/master",
            repo: "GIT_REPOSITORY",
            path: "DESTINATION_PATH",
            "pre-deploy-local": "",
            "post-deploy":
                "npm install && pm2 reload ecosystem.config.js --env production",
            "pre-setup": "",
        },
    },
};
