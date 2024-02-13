// ServerEvents.recipes((event) => {
//   function makeSpiritOrb(item) {
//     event.shaped(
//       Item.of("", 2), // make TODO: paragliders:spirit_orb
//       [
//         "AAA",
//         "ABA",
//         "AAA",
//       ],
//       {
//         A: item,
//       }
//     );
//   }

//   makeSpiritOrb("") //TODO: put item name in args

//   event.shaped(
//     Item.of(" MAGIC MIRROR ", 1), //TODO: magic mirror
//     [
//       "AAA",
//       "ABA",
//       "AAA",
//     ],
//     {
//       A: " DIAMOND ",
//       B: " SOUL PEARL ",
//     }
//   );

//   console.log("Hello! The recipe event has fired!");
// });
Platform.mods.kubejs.name = 'Chowkingdom'

StartupEvents.registry('item', event => {
  event.create('chowcoin').maxStackSize(64).texture('gisketch:item/smallcoin')
})

