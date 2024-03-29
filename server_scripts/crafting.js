ServerEvents.recipes((event) => {
    function makeSpiritOrb(item) {
        event.shapeless(Item.of("paraglider:spirit_orb", 1), ["9x " + item]);
    }

    makeSpiritOrb("reliquary:bat_wing");
    makeSpiritOrb("reliquary:zombie_heart");
    makeSpiritOrb("reliquary:squid_beak");
    makeSpiritOrb("reliquary:guardian_spike");
    makeSpiritOrb("reliquary:nebulous_heart");
    makeSpiritOrb("reliquary:eye_of_the_storm");
    makeSpiritOrb("reliquary:rib_bone");
    makeSpiritOrb("reliquary:catalyzing_gland");
    makeSpiritOrb("reliquary:chelicerae");
    makeSpiritOrb("reliquary:slime_pearl");
    makeSpiritOrb("reliquary:withered_rib");
    makeSpiritOrb("reliquary:molten_core");

    // event.smelting("kubejs:copper_chowcoin", "minecraft:copper_ingot");
    // event.smelting("kubejs:iron_chowcoin", "minecraft:iron_ingot");
    // event.smelting("kubejs:gold_chowcoin", "minecraft:gold_ingot");
    // event.smelting("kubejs:diamond_chowcoin", "minecraft:diamond");

    event.shaped(Item.of("kubejs:iron_chowcoin", 1),
        ["AAA", "A A", "AAA"],
        {
            A: "kubejs:copper_chowcoin"
        }
    );

    event.shaped(Item.of("kubejs:gold_chowcoin", 1),
        ["AAA", "A A", "AAA"],
        {
            A: "kubejs:iron_chowcoin"
        }
    );

    event.shaped(Item.of("kubejs:diamond_chowcoin", 1),
        ["AAA", "A A", "AAA"],
        {
            A: "kubejs:gold_chowcoin"
        }
    );

    event.shapeless(Item.of("kubejs:iron_chowcoin", 1), [
        "8x kubejs:copper_chowcoin",
    ]);

    event.shapeless(Item.of("kubejs:gold_chowcoin", 1), [
        "8x kubejs:iron_chowcoin",
    ]);

    event.shapeless(Item.of("kubejs:diamond_chowcoin", 1), [
        "8x kubejs:gold_chowcoin",
    ]);

    // Remove all recipes for magic mirror
    event.remove({ id: "magic_mirror_mod:magic_mirror_recipe" });

    event.shaped(
        Item.of("magic_mirror_mod:magic_mirror", 1),
        ["AAA", "CBC", "AAA"],
        {
            A: "minecraft:diamond",
            B: "endermanoverhaul:soul_pearl",
            C: "minecraft:glass",
        },
    );

    console.log("Hello! The recipe event has fired!");
});

