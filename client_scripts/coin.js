ItemEvents.tooltip((event) => {
    function addChowcoin(itemName) {
        event.addAdvanced(itemName, (item, advanced, text) => {
            text.add(1, [
                Text.white("This "),
                Text.gold("coin").bold(true),
                Text.white(" serves as the currency for the Chowkingdom server."),
            ]);
        });
    }

    addChowcoin("kubejs:copper_chowcoin");
    addChowcoin("kubejs:iron_chowcoin");
    addChowcoin("kubejs:gold_chowcoin");
    addChowcoin("kubejs:diamond_chowcoin");
});
