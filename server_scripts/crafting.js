ServerEvents.recipes((event) => {
    // function makeSpiritOrb(item) {
    //     event.shaped(
    //         Item.of("", 2), // make TODO: paragliders:spirit_orb
    //         ["AAA", "ABA", "AAA"],
    //         {
    //             A: item,
    //         },
    //     );
    // }
    //
    // makeSpiritOrb(""); //TODO: put item name in args
    //
    // event.shaped(
    //     Item.of(" MAGIC MIRROR ", 1), //TODO: magic mirror
    //     ["AAA", "ABA", "AAA"],
    //     {
    //         A: " DIAMOND ",
    //         B: " SOUL PEARL ",
    //     },
    // );

    // event.shaped(
    //     Item.of("kubejs", 1), //TODO: magic mirror
    //     ["AAA", "ABA", "AAA"],
    //     {
    //         A: " DIAMOND ",
    //         B: " SOUL PEARL ",
    //     },
    // );
    //
    event.smelting("kubejs:copper_chowcoin", "minecraft:copper_ingot");
    event.smelting("kubejs:iron_chowcoin", "minecraft:iron_ingot");
    event.smelting("kubejs:gold_chowcoin", "minecraft:gold_ingot");
    event.smelting("kubejs:diamond_chowcoin", "minecraft:diamond");

    event.shapeless(Item.of("kubejs:iron_chowcoin", 1), [
        "9x kubejs:copper_chowcoin",
    ]);

    event.shapeless(Item.of("kubejs:gold_chowcoin", 1), [
        "9x kubejs:iron_chowcoin",
    ]);

    event.shapeless(Item.of("kubejs:diamond_chowcoin", 1), [
        "9x kubejs:gold_chowcoin",
    ]);

    console.log("Hello! The recipe event has fired!");
});

EntityEvents.death("player", (event) => {
    const { player } = event;
    player.block.popItem(Item.playerHead(player.username));
});

PlayerEvents.chat((event) => {
    console.log(event.message);
    if (event.message.trim().toLowerCase() == "creeper") {
        event.server.scheduleInTicks(1, event.server, (ctx) => {
            ctx.data.tell(Text.green("Aw man"));
        });
    }
});
