PlayerEvents.loggedIn((event) => {
    const welcomeLines = [
        "§6§l🌟 Welcome to Chowkingdom Season 3 SMP! 🌟",
        "",
        "§2💖 Support: §fConsider supporting to keep the adventure going!",
        "§7GCash: §f09309118777",
        "§7Maya: §f09164363097",
        "",
        "§7Every login is the start of a new adventure. Enjoy your stay!",
    ];

    welcomeLines.forEach((line) => event.player.tell(line));
});
