Platform.mods.kubejs.name = 'Chowkingdom'

StartupEvents.registry('item', event => {
  event.create('base_chowcoin').maxStackSize(64).texture('gisketch:item/basecoin')
  event.create('copper_chowcoin').maxStackSize(64).texture('gisketch:item/coppercoin')
  event.create('iron_chowcoin').maxStackSize(64).texture('gisketch:item/ironcoin')
  event.create('gold_chowcoin').maxStackSize(64).texture('gisketch:item/goldcoin')
  event.create('diamond_chowcoin').maxStackSize(64).texture('gisketch:item/diamondcoin')
})

