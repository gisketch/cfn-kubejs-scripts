const dropRate = 0.05

LootJS.modifiers((event) => {
    event
        .addLootTypeModifier([LootType.ENTITY])
        .killedByPlayer()
        .matchEntity((entity) => {
            entity.isMonster;
        })
        .randomChance(dropRate)
        .addLoot("kubejs:copper_chowcoin");

    event
        .addLootTypeModifier([LootType.ENTITY])
        .killedByPlayer()
        .matchEntity((entity) => {
            entity.anyType("#raiders");
        })
        .randomChance(dropRate * 2)
        .addLoot("kubejs:iron_chowcoin");

    event
        .addLootTableModifier(/.*piglin.*/)
        .killedByPlayer()
        .randomChance(dropRate * 3)
        .addLoot("kubejs:gold_chowcoin");

    event
        .addLootTypeModifier([LootType.ENTITY])
        .killedByPlayer()
        .matchEntity((entity) => {
            entity.anyType("#bosses");
        })
        .addLoot("kubejs:diamond_chowcoin");

    event
        .addLootTypeModifier([LootType.CHEST])
        .randomChance(dropRate * 6)
        .addLoot("kubejs:copper_chowcoin");

    event
        .addLootTypeModifier([LootType.CHEST])
        .randomChance(dropRate * 3)
        .addLoot("kubejs:iron_chowcoin");

    event
        .addLootTypeModifier([LootType.CHEST])
        .randomChance(dropRate)
        .addLoot("kubejs:gold_chowcoin");

    event
        .addLootTypeModifier([LootType.CHEST])
        .randomChance(0.01)
        .addLoot("kubejs:diamond_chowcoin");


    event
        .addLootTypeModifier([LootType.FISHING])
        .randomChance(dropRate * 2)
        .addLoot("kubejs:copper_chowcoin");

    event
        .addLootTypeModifier([LootType.FISHING])
        .randomChance(dropRate)
        .addLoot("kubejs:iron_chowcoin");

    event
        .addLootTypeModifier([LootType.FISHING])
        .randomChance(0.025)
        .addLoot("kubejs:gold_chowcoin");

    event
        .addLootTypeModifier([LootType.FISHING])
        .randomChance(0.005)
        .addLoot("kubejs:diamond_chowcoin");

});
