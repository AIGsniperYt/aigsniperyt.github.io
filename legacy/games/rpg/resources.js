class Resources {
    // Constructor
    constructor() {
        // Everything we plan to download
        this.toload = {
            player: "player.png",
            treeDay: "tree-day.png",
            treeNight: "tree-night.png",
            badDay: "tree-day1.png",
            badNight: "tree-night1.png",
            plusIcon: "plus-icon.png",
            settingsIcon: "settings-icon.png",
            homeIcon: "home-icon.png",

        };

        // A place to keep all of our images
        this.images = {};

        // Load each image
        Object.keys(this.toload).forEach((key) => {
            const img = new Image();
            img.src = this.toload[key];
            this.images[key] = {
                image: img,
                isLoaded: false,
            };

            img.onload = () => {
                this.images[key].isLoaded = true;
            };
        });
    }
}

// Export a constant instance of the Resources class
export const resources = new Resources();
